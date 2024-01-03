import Joi from 'joi'
import { GET_DB } from '~/config/mongodb'
import ENUM from '~/utils/enum'
import { transformToObjectId } from '~/utils/helpers'
import { OBJECT_ID_REGEX } from '~/utils/validators'

const COLLECTION_NAME = 'rooms'
const COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(1000).trim().strict(),
  creator_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_REGEX)
    .custom(transformToObjectId),
  members: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_REGEX).custom(transformToObjectId))
    .default([]),
  type: Joi.number().valid(...ENUM.ROOM_TYPE),

  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null)
})

const validateBeforeCreate = async (data) => {
  return await COLLECTION_SCHEMA.validateAsync(data, {
    abortEarly: false
  })
}

const createNew = async (data) => {
  try {
    const standardData = await validateBeforeCreate(data)
    return await GET_DB().collection(COLLECTION_NAME).insertOne(standardData)
  } catch (error) {
    throw new Error(error)
  }
}

export const roomModel = {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  createNew
}
