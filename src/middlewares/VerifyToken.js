import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: true, message: 'Mã xác thực không hợp lệ!' })
  }
  token = token.replace(/^Bearer\s+/, '')

  jwt.verify(token, env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send({ error: true, message: 'Từ chối truy cập!' })
    }

    req.username = decoded.username

    let user = await GET_DB().collection(userModel.COLLECTION_NAME).findOne({
      username: req.username,
      deleted_at: null
    })

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: true, message: 'Tài khoản không hợp lệ!' })
    }

    req.user_id = user._id
    next()
  })
}

export default verifyToken
