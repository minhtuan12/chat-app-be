import express from 'express'
import { authController } from '~/controllers/authController'
import verifyToken from '~/middlewares/VerifyToken'
import { validate } from '~/utils/validators'
import { authValidation, validateExistUser } from '~/validations/authValidation'

const Router = express.Router()

Router.post(
  '/login',
  validate(authValidation.login),
  validateExistUser,
  authController.login
)

Router.get('/me', verifyToken, authController.me)

export const authRoute = Router
