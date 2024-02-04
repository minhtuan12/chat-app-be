import axios from 'axios'
import { ObjectId } from 'mongodb'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { messageModel } from '~/models/messageModel'
import { roomModel } from '~/models/roomModel'
import ENUM from '~/utils/enum'
import {
  createChatRoomName,
  createRoomChatPrivateName,
  createRoomNotifyName
} from '~/utils/helpers'

const createNew = async (req) => {
  try {
    const room_private = req.room_private
    const sender_id = req.user_id
    const { message } = req.body
    const receiver = req.receiver

    if (room_private) {
      const newMessage = await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: room_private._id.toString(),
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })

      await axios({
        baseURL: env.SOCKET_DOMAIN,
        method: 'POST',
        url: 'chat/send-message',
        data: {
          room_name: createRoomChatPrivateName(room_private._id.toString()),
          data: { ...newMessage.document }
        }
      })
    } else {
      const sender = req.username
      const chatRoomName = createChatRoomName(sender, receiver.username)

      const createRoom = await roomModel.createNew({
        creator_id: sender_id.toString(),
        name: chatRoomName,
        members: [receiver._id.toString()],
        type: ENUM.ROOM_TYPE['PRIVATE']
      })

      await axios({
        baseURL: env.SOCKET_DOMAIN,
        method: 'POST',
        url: 'chat/personal-notify',
        data: {
          personal_room_names: [
            createRoomNotifyName(req.user_id),
            createRoomNotifyName(receiver._id.toString())
          ],
          data: {
            type: 'create-room-chat-private',
            data: { ...createRoom.document }
          }
        }
      })

      await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: createRoom.insertedId.toString(),
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })
    }

    await axios({
      baseURL: env.SOCKET_DOMAIN,
      method: 'POST',
      url: 'chat/personal-notify',
      data: {
        personal_room_names: [createRoomNotifyName(receiver._id.toString())],
        data: {
          type: 'has-new-message',
          data: { sender_id: sender_id.toString() }
        }
      }
    })

    return {
      message: 'Gửi thành công!'
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getMessageByRoomId = async (req) => {
  const { room_id } = req.params

  const result = await GET_DB()
    .collection('messages')
    .updateMany(
      { room_id: new ObjectId(room_id), delete_at: null },
      [
        {
          $set: {
            status: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ['$room_id', new ObjectId(room_id)] },
                    { $ne: ['$creator_id', req.user_id] }
                  ]
                },
                then: ENUM.MESSAGE_STATUS['SEEN'],
                else: '$status'
              }
            }
          }
        }
      ],
      { returnDocument: 'after' }
    )

  if (result.modifiedCount > 0) {
    await axios({
      baseURL: env.SOCKET_DOMAIN,
      method: 'POST',
      url: 'chat/seen-message',
      data: {
        room_name: createRoomChatPrivateName(room_id),
        data: {
          room_id,
          seen_all: true
        }
      }
    })
  }

  const messages = await GET_DB()
    .collection(messageModel.COLLECTION_NAME)
    .find({ room_id: new ObjectId(room_id) })
    .sort({ created_at: 1 })
    .toArray()

  return messages
}

const confirmSeenMessage = async (req) => {
  const { room_id, list_message } = req.body
  const result = await GET_DB()
    .collection('messages')
    .updateMany(
      {
        _id: { $in: list_message.map((id) => new ObjectId(id)) },
        room_id: new ObjectId(room_id)
      },
      { $set: { status: ENUM.MESSAGE_STATUS['SEEN'] } }
    )

  await axios({
    baseURL: env.SOCKET_DOMAIN,
    method: 'POST',
    url: 'chat/seen-message',
    data: {
      room_name: createRoomChatPrivateName(room_id),
      data: {
        room_id,
        list_message
      }
    }
  })
  return result
}

export const chatService = {
  createNew,
  getMessageByRoomId,
  confirmSeenMessage
}
