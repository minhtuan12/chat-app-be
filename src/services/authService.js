import { comparePassword } from '~/utils/helpers'
import jwt from 'jsonwebtoken'
import env from '~/config/environment'
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'

const login = async (req) => {
  try {
    let { password } = req.body
    const entity = req.entity

    const verified = await comparePassword(password, entity.password)

    if (!verified) return verified

    let token = jwt.sign(
      { username: entity.username, name: entity.name, avatar: entity.avatar },
      env.JWT_SECRET,
      {
        expiresIn: env.JWT_EXPIRES_IN || 36000
      }
    )
    return {
      token: token,
      expire_in: env.JWT_EXPIRES_IN,
      auth_type: 'Bearer Token'
    }
  } catch (error) {
    throw new Error(error)
  }
}

const me = async (req) => {
  try {
    let result = await GET_DB()
      .collection(userModel.COLLECTION_NAME)
      .aggregate([
        {
          $match: { _id: req.user_id, deleted_at: null }
        }
      ])
      .toArray()
    if (result) {
      result = (({ password, deleted_at, ...agr }) => agr)(result[0])
    }

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const authService = {
  login,
  me
}
