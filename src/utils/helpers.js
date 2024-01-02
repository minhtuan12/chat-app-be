import bcrypt from 'bcrypt'

export const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

export const comparePassword = async (password, passwordHash) => {
  const validPassword = await bcrypt.compare(password, passwordHash)
  return !!validPassword
}
