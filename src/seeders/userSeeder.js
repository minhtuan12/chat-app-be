/* eslint-disable no-console */
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import { generatePassword } from '~/utils/helpers'

const users = [
  {
    name: 'Super Admin',
    username: 'admin@zent.vn',
    password: '123456',
    avatar:
      'https://junkee.com/wp-content/uploads/2017/04/static1.squarespace.jpg'
  },
  {
    name: 'Super Tuân',
    username: 'tuannm@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/5G3eHywNDrYZQOZwub4Ukm42E29iSpEvqM1jRPvv.gif'
  },
  {
    name: 'Chiến Vũ',
    username: 'chienvd@zent.vn',
    password: 'Chienvu97',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/ds8CqG2iZs5rZIE2jjFUOpimJ3CSgapoON53Y5i1.gif'
  },
  {
    name: 'Tú Đội',
    username: 'tudoi@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/tyME0OzSCC8qZsBQ00pA9EbF5pg1sL6EGOW7Po6Z.gif'
  },
  {
    name: 'Đào Hà',
    username: 'daoth@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/soa8m629QQlYtrPgUw983N8pmIbfdrd2bJcVczDR.gif'
  },
  {
    name: 'Phong Thần',
    username: 'phongthan@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/MijguhyxZmkX7UbzmneOHAO9LtBaFc1fEueAI1Lz.jpg'
  },
  {
    name: 'Cẩn óc ó',
    username: 'cannd@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/A3vX7PEqNgjMoBX2BxsvQucrv2kXkzMfz6bsKJs2.gif'
  },
  {
    name: 'Super Tố',
    username: 'tolc@zent.vn',
    password: '123456',
    avatar:
      'https://ep-api.zent.vn/storage/uploads/avatar/cfi3oaHbiOm9v4H83L9KdvJUddE5eOQWdWJVUfak.jpg'
  }
]


const userSeeder = async () => {
  const updatePromises = users.map(async (user) => {
    const infoUser = await userModel.validateBeforeCreate({
      ...user,
      password: await generatePassword(user.password)
    })

    return GET_DB()
      .collection(userModel.COLLECTION_NAME)
      .updateMany(
        { username: user.username },
        {
          $set: {
            ...infoUser
          }
        },
        { upsert: true }
      )
  })

  // Đợi cho tất cả các promises hoàn thành
  await Promise.all(updatePromises)

  console.log('Seed data user successful')
  return
}

export default userSeeder
