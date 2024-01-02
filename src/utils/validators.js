import { StatusCodes } from 'http-status-codes'
import ApiError from './ApiError'

export const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/

export const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}
