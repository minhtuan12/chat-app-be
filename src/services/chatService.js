import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { messageModel } from '~/models/messageModel'
import { roomModel } from '~/models/roomModel'
import ENUM from '~/utils/enum'
import { createChatRoomName } from '~/utils/helpers'

const createNew = async (req) => {
  try {
    const room_private = req.room_private
    const sender_id = req.user_id
    const { message } = req.body

    if (room_private) {
      await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: room_private._id.toString(),
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })
    } else {
      const receiver = req.receiver
      const sender = req.username
      const chatRoomName = createChatRoomName(sender, receiver.username)

      const createRoom = await roomModel.createNew({
        creator_id: sender_id.toString(),
        name: chatRoomName,
        members: [receiver._id.toString()],
        type: ENUM.ROOM_TYPE['PRIVATE']
      })

      await messageModel.createNew({
        creator_id: sender_id.toString(),
        room_id: createRoom.insertedId.toString(),
        content: message,
        status: ENUM.MESSAGE_STATUS['UNSEEN']
      })
    }

    return {
      message: 'Gửi thành công!'
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
