import Joi from 'joi'
import { OBJECT_ID_REGEX } from '~/utils/validators'

const COLLECTION_NAME = 'rooms'
const COLLECTION_SCHEMA = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().strict(),
  creator_id: Joi.string().required().pattern(OBJECT_ID_REGEX),
  member: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX)).default([]),

  created_at: Joi.date().timestamp('javascript').default(Date.now),
  updated_at: Joi.date().timestamp('javascript').default(null),
  deleted_at: Joi.date().timestamp('javascript').default(null)
})

export const userModel = {
  COLLECTION_NAME,
  COLLECTION_SCHEMA
}
