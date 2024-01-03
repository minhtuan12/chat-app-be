import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import { roomModel } from '~/models/roomModel'
import { userModel } from '~/models/userModel'
import ApiError from '~/utils/ApiError'
import { OBJECT_ID_REGEX } from '~/utils/validators'
import { ObjectId } from 'mongodb'
import ENUM from '~/utils/enum'

export const checkUserBelongToRoom = async (req, res, next) => {
  try {
    const user_id = req.user_id
    const { room_id } = req.params

    if (!OBJECT_ID_REGEX.test(room_id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        message: 'Mã phòng không đúng định dạng!'
      })
    }

    const room = await GET_DB()
      .collection(roomModel.COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(room_id),
        $or: [
          { creator_id: new ObjectId(user_id) },
          { members: { $elemMatch: { $eq: new ObjectId(user_id) } } }
        ]
      })

    if (room) {
      next()
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        message: 'Bạn không có quyền truy cập phòng chat này!'
      })
    }
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const ValidateUserAndMessageExists = async (req, res, next) => {
  try {
    let { receiver_id } = req.body
    const user_id = req.user_id

    const receiver = await GET_DB()
      .collection(userModel.COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(receiver_id),
        delete_at: null
      })

    if (!receiver) {
      return res.status(StatusCodes.FORBIDDEN).json({
        error: true,
        message: 'Người nhận không tồn tại hoặc đã bị xóa!'
      })
    }

    const room_private = await GET_DB()
      .collection(roomModel.COLLECTION_NAME)
      .findOne({
        type: ENUM.ROOM_TYPE['PRIVATE'],
        $or: [
          {
            creator_id: new ObjectId(user_id),
            members: [new ObjectId(receiver_id)]
          },
          {
            creator_id: new ObjectId(receiver_id),
            members: [new ObjectId(user_id)]
          }
        ]
      })

    req.room_private = room_private
    req.receiver = (({ password, deleted_at, ...arg }) => arg)(receiver)
    next()
  } catch (error) {
    next(
      new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message)
    )
  }
}

export const chatValidation = {
  sendMessage: Joi.object({
    message: Joi.string().required().trim().max(1000).messages({
      'string.base': 'Tin nhắn phải là một chuỗi kí tự',
      'any.required': 'Tin nhắn không được bỏ trống',
      'string.empty': 'Tin nhắn không được bỏ trống',
      'string.max': 'Tin nhắn không được quá 1000 ký tự'
    }),
    receiver_id: Joi.string().required().pattern(OBJECT_ID_REGEX).messages({
      'string.base': 'Id người nhận phải là một chuỗi kí tự',
      'string.pattern.base': 'Id người nhận không đúng định dạng',
      'any.required': 'Id người nhận không được bỏ trống',
      'string.empty': 'Id người nhận không được bỏ trống'
    })
  })
}
