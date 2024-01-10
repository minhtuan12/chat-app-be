/* eslint-disable no-console */
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import userSeeder from './userSeeder'

async function main() {
  try {
    await CONNECT_DB()
    await userSeeder()
    console.log('Seed done.')
    CLOSE_DB()
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

main()
