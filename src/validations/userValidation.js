import Joi from 'joi'

const createUser = Joi.object({
  name: Joi.string().required().min(2).max(100).trim().strict().messages({
    'any.required': 'Họ tên không được bỏ trống',
    'string.empty': 'Họ tên không được bỏ trống',
    'string.min': 'Họ tên tối thiểu 2 ký tự',
    'string.max': 'Họ tên tối đa 100 ký tự',
    'string.trim': 'Họ tên không được có khoảng trống ở đầu và cuối'
  }),
  username: Joi.string().required().trim().strict(),
  password: Joi.string().required().trim().strict(),
  avatar: Joi.string().required().trim().strict()
})

export const userValidation = {
  createUser
}
