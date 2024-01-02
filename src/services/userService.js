import { userModel } from '~/models/userModel'
import { generatePassword } from '~/utils/helpers'

const createNew = async (reqBody) => {
  try {
    let { name, username, password, avatar, friend } = reqBody
    return await userModel.createNew({
      name,
      username,
      password: await generatePassword(password),
      avatar,
      friend
    })
  } catch (error) {
    throw new Error(error)
  }
}

export const userService = {
  createNew
}
