import express from 'express'
import { chatController } from '~/controllers/chatController'
import verifyToken from '~/middlewares/VerifyToken'
import { validate } from '~/utils/validators'
import {
  ValidateUserAndMessageExists,
  ValidateUserAndRoomExists,
  chatValidation,
  checkUserBelongToRoom
} from '~/validations/chatValidation'
const Router = express.Router()

Router.get(
  '/:room_id',
  verifyToken,
  checkUserBelongToRoom,
  chatController.getMessageInRoom
)

Router.post(
  '/send-message',
  validate(chatValidation.sendMessage),
  verifyToken,
  ValidateUserAndMessageExists,
  chatController.createNew
)

Router.post(
  '/confirm-seen-message',
  validate(chatValidation.seenMessage),
  verifyToken,
  ValidateUserAndRoomExists,
  chatController.confirmSeenMessage
)

export const chatRoute = Router
