import Joi from 'joi'
import ENUM from '~/utils/enum'
import { OBJECT_ID_REGEX } from '~/utils/validators'

const COLLECTION_NAME = 'messages'
const COLLECTION_SCHEMA = Joi.object({
  creator_id: Joi.string().required().pattern(OBJECT_ID_REGEX),
  room_id: Joi.string().required().pattern(OBJECT_ID_REGEX),
  content: Joi.string().required(),
  status: Joi.number().valid(...ENUM.MESSAGE_STATUS),

  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null)
})

export const userModel = {
  COLLECTION_NAME,
  COLLECTION_SCHEMA
}
