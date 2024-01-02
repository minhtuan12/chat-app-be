import { MongoClient, ServerApiVersion } from 'mongodb'
import env from './environment'

let chatAppDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  chatAppDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
  if (!chatAppDatabaseInstance)
    throw new Error('Must connect to Database first!')
  return chatAppDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}
