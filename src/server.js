/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { APIs } from './routes/api'
import env from './config/environment'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { rateLimit } from 'express-rate-limit'

const START_SERVER = () => {
  const app = express()

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false
  })

  //Api timeout limit
  app.use(limiter)

  //Use cors
  app.use(cors(corsOptions))

  const hostname = env.APP_HOST || 'localhost'
  const port = env.APP_PORT || 3001

  //Enable req.body json data
  app.use(express.json())

  //Use APIs
  app.use('/api', APIs)

  app.get('/', (req, res) => {
    res.end('<h1>Server running...</h1><hr>')
  })

  //error handling middleware
  app.use(errorHandlingMiddleware)

  app.listen(port, hostname, () => {
    console.log(`Hello world, I am running at ${hostname}:${port}/`)
  })

  exitHook(() => {
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => console.log('Connected to Database!'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error)
    process.exit(0)
  })
