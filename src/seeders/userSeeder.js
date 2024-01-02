/* eslint-disable no-console */
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import { generatePassword } from '~/utils/helpers'

const user = {
  name: 'Super Tố',
  username: 'admin@zent.vn',
  password: 'Zent@123.edu.vn',
  avatar:
    'https://junkee.com/wp-content/uploads/2017/04/static1.squarespace.jpg'
}

const userSeeder = async () => {
  const infoUser = await userModel.validateBeforeCreate({
    ...user,
    password: await generatePassword(user.password)
  })
  return await GET_DB()
    .collection(userModel.COLLECTION_NAME)
    .updateOne(
      { username: user.username },
      {
        $set: {
          ...infoUser
        }
      },
      { upsert: true }
    )
  // eslint-disable-next-line no-unreachable
  console.log('Seed data user successful')
}

export default userSeeder
