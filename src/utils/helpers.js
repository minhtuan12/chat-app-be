import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { OBJECT_ID_REGEX } from './validators'

export const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password, passwordHash) => {
  const validPassword = await bcrypt.compare(password, passwordHash)
  return !!validPassword
}

export const createChatRoomName = (user1Name, user2Name) => {
  return `${user1Name} and ${user2Name}'s Chat Room`
}

export const transformToObjectId = (value, helpers) => {
  if (typeof value === 'string' && value.match(OBJECT_ID_REGEX)) {
    return new ObjectId(value)
  }
  return helpers.error('any.custom', { message: 'Invalid ObjectId' })
}
