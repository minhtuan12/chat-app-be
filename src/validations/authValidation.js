import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'

export const validateExistUser = async (req, res, next) => {
  try {
    let { username } = req.body
    let entity = await GET_DB().collection(userModel.COLLECTION_NAME).findOne({
      username: username,
      deleted_at: null
    })

    if (!entity) {
      return res.status(StatusCodes.NOT_FOUND).json({
        error: true,
        message: 'Tài khoản không tồn tại!'
      })
    }

    req.entity = entity
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const authValidation = {
  login: Joi.object({
    username: Joi.string().required().trim().max(255).messages({
      'string.base': 'tài khoản phải là một chuỗi kí tự',
      'any.required': 'tài khoản không được bỏ trống',
      'string.empty': 'tài khoản không được bỏ trống',
      'string.max': 'tài khoản không được quá 255 ký tự'
    }),
    password: Joi.string().required().messages({
      'string.base': 'Mật khẩu phải là một chuỗi kí tự',
      'string.empty': 'Mật khẩu không được bỏ trống',
      'any.required': 'Mật khẩu không được bỏ trống'
    })
  })
}
