import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import ENUM from '~/utils/enum'
import { transformToObjectId } from '~/utils/helpers'
import { OBJECT_ID_REGEX } from '~/utils/validators'

const COLLECTION_NAME = 'messages'
const COLLECTION_SCHEMA = Joi.object({
  creator_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_REGEX)
    .custom(transformToObjectId),
  room_id: Joi.string()
    .required()
    .pattern(OBJECT_ID_REGEX)
    .custom(transformToObjectId),
  content: Joi.string().required(),
  status: Joi.number().valid(...ENUM.MESSAGE_STATUS),

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
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(standardData)
    return { ...result, document: { ...standardData, _id: result.insertedId } }
  } catch (error) {
    throw new Error(error)
  }
}

const getMessageById = async (msg_id) => {
  try {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne(
        {
          $and: [{ _id: new ObjectId(msg_id) }, { deleted_at: null }]
        },
        {
          projection: {
            deleted_at: 0
          }
        }
      )
  } catch (error) {
    throw new Error(error)
  }
}

export const messageModel = {
  COLLECTION_NAME,
  COLLECTION_SCHEMA,
  createNew,
  getMessageById
}
