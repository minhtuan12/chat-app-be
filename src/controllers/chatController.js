import { StatusCodes } from 'http-status-codes'
import { chatService } from '~/services/chatService'

const createNew = async (req, res, next) => {
  try {
    const saveMessage = await chatService.createNew(req)
    res.status(StatusCodes.CREATED).json(saveMessage)
  } catch (error) {
    next(error)
  }
}

const getMessageInRoom = async (req, res, next) => {
  try {
    const listMessage = await chatService.getMessageByRoomId(req)
    res.status(StatusCodes.OK).json(listMessage)
  } catch (error) {
    next(error)
  }
}

export const chatController = {
  createNew,
  getMessageInRoom
}
