import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { validate } from '~/utils/validators'
import { userValidation } from '~/validations/userValidation'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'success' })
  })
  .post(validate(userValidation.createUser), (req, res) => {
    res.status(StatusCodes.OK).json({ msg: 'success' })
  })

export const userRoute = Router
