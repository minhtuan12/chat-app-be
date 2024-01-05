/* eslint-disable no-console */
import { GET_DB } from '~/config/mongodb'
import { userModel } from '~/models/userModel'
import { generatePassword } from '~/utils/helpers'

const users = [
  {
    name: 'Super Tố',
    username: 'admin@zent.vn',
    password: 'Zent@123.edu.vn',
    avatar:
      'https://junkee.com/wp-content/uploads/2017/04/static1.squarespace.jpg'
  },
  {
    name: 'Super Tuân',
    username: 'tuannm@zent.vn',
    password: 'Zent@123.edu.vn',
    avatar:
      'https://thcs-thptlongphu.edu.vn/wp-content/uploads/2023/03/hinh-anh-dep-tren-mang2b252822529.jpg'
  },
  {
    name: 'Chiến Vũ',
    username: 'chienvd@zent.vn',
    password: 'Chienvu97',
    avatar:
      'https://tophcm.vn/wp-content/uploads/2021/10/hinh-anh-nen-anh-gau-trang-cute-3-577x1024.jpg'
  },
  {
    name: 'Tú Đội',
    username: 'tudoi@zent.vn',
    password: 'Zent@123.edu.vn',
    avatar:
      'https://img5.thuthuatphanmem.vn/uploads/2022/01/12/anh-avatar-cool-ngau-cuc-chat_094940368.jpg'
  },
  {
    name: 'Đào Hà',
    username: 'daoth@zent.vn',
    password: 'Zent@123.edu.vn',
    avatar:
      'https://drallen.com.vn/wp-content/uploads/2023/09/chup-anh-di-bien.jpg'
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
