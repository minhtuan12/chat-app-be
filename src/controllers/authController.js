import { StatusCodes } from 'http-status-codes'
import { authService } from '~/services/authService'
import ApiError from '~/utils/ApiError'

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req)
    if (!result)
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: true,
        message: 'Tài khoản hoặc mật khẩu không chính xác!'
      })

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    )
  }
}

const me = async (req, res, next) => {
  try {
    const result = await authService.me(req)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(
      new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, new Error(error).message)
    )
  }
}

export const authController = {
  login,
  me
}
