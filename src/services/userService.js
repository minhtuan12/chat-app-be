import { GET_DB } from '~/config/mongodb'
import { roomModel } from '~/models/roomModel'
import { userModel } from '~/models/userModel'
import { generatePassword } from '~/utils/helpers'

const createNew = async (reqBody) => {
  try {
    let { name, username, password, avatar, friend } = reqBody
    return await userModel.createNew({
      name,
      username,
      password: await generatePassword(password),
      avatar,
      friend
    })
  } catch (error) {
    throw new Error(error)
  }
}

const getList = async (req) => {
  try {
    let { q, page, page_size } = req.query
    q = q ? { $regex: new RegExp(q, 'i') } : null
    page = page ? Number(page) : 1
    page_size = page_size ? Number(page_size) : 20
    const result = await GET_DB()
      .collection(userModel.COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            deleted_at: null,
            _id: { $ne: req.user_id },
            ...(q ? { $or: [{ name: q }, { username: q }] } : null)
          }
        },
        {
          $lookup: {
            from: roomModel.COLLECTION_NAME,
            let: { friendId: '$_id' },
            pipeline: [
              {
                $match: {
                  deleted_at: null,
                  $expr: {
                    $or: [
                      {
                        $and: [
                          { $eq: ['$creator_id', req.user_id] },
                          { $in: ['$$friendId', '$members'] }
                        ]
                      },
                      {
                        $and: [
                          { $eq: ['$creator_id', '$$friendId'] },
                          { $in: [req.user_id, '$members'] }
                        ]
                      }
                    ]
                  },
                  type: 0
                }
              },
              {
                $lookup: {
                  from: 'messages',
                  let: { roomId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        deleted_at: null,
                        status: 0,
                        $expr: {
                          $and: [
                            { $eq: ['$room_id', '$$roomId'] },
                            { $ne: ['$creator_id', req.user_id] }
                          ]
                        }
                      }
                    },
                    {
                      $count: 'total'
                    }
                  ],
                  as: 'count_unseen'
                }
              },
              {
                $project: {
                  deleted_at: 0
                }
              },
              {
                $addFields: {
                  count_unseen: {
                    $cond: {
                      if: { $gt: [{ $size: '$count_unseen' }, 0] },
                      then: { $arrayElemAt: ['$count_unseen.total', 0] },
                      else: 0
                    }
                  }
                }
              }
            ],
            as: 'room'
          }
        },
        { $skip: (page - 1) * page_size },
        { $limit: page_size },
        {
          $addFields: {
            room: {
              $cond: {
                if: {
                  $and: [
                    { $isArray: '$room' },
                    { $gt: [{ $size: '$room' }, 0] }
                  ]
                },
                then: { $arrayElemAt: ['$room', 0] },
                else: null
              }
            }
          }
        },
        {
          $project: {
            password: 0,
            deleted_at: 0
          }
        }
      ])
      .toArray()

    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userService = {
  createNew,
  getList
}
