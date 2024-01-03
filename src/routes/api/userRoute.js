import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userController } from '~/controllers/userController'
import verifyToken from '~/middlewares/VerifyToken'
import { validate } from '~/utils/validators'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/')
  .get(verifyToken, userController.getList)
  .post(validate(userValidation.createUser), (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'success' })
  })

export const userRoute = Router
