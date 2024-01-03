import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { messageModel } from '~/models/messageModel'
import { roomModel } from '~/models/roomModel'
import ENUM from '~/utils/enum'
import { createChatRoomName } from '~/utils/helpers'

const createNew = async (req) => {
  try {
    const firstMessage = req.firstMessage
    const sender = req.username
    const sender_id = req.user_id
    const { message } = req.body

    if (firstMessage) {
      const receiver = req.receiver
      const chatRoomName = createChatRoomName(sender, receiver.username)

      const createRoom = await roomModel.createNew({
        creator_id: sender_id.toString(),
        name: chatRoomName,
        members: [receiver._id.toString()],
        type: ENUM.ROOM_TYPE['PRIVATE']
      })

      const createMessage = await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: createRoom.insertedId.toString(),
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })

      return {
        room_id: createRoom.insertedId,
        message_id: createMessage.insertedId,
        message: 'Gửi thành công!'
      }
    } else {
      const { room_id } = req.body
      await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: room_id,
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })

      return {
        message: 'Gửi thành công!'
      }
    }
  } catch (error) {
    throw new Error(error)
  }
}

const getMessageByRoomId = async (req) => {
  const { room_id } = req.params
  const messages = await GET_DB()
    .collection(messageModel.COLLECTION_NAME)
    .find({ room_id: new ObjectId(room_id) })
    .sort({ created_at: 1 })
    .toArray()

  return messages
}

export const chatService = {
  createNew,
  getMessageByRoomId
}
