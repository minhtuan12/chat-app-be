import express from 'express'
import { chatController } from '~/controllers/chatController'
import verifyToken from '~/middlewares/VerifyToken'
import { validate } from '~/utils/validators'
import {
  ValidateCanUserSendMessageToRoom,
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
  ValidateCanUserSendMessageToRoom,
  chatController.createNew
)

export const chatRoute = Router
