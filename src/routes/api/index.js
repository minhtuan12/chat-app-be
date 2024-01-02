import express from 'express'
import { authRoute } from './authRoute'
import { userRoute } from './userRoute'

const Router = express.Router()

//Authentication
Router.use('/auth', authRoute)

//Users
Router.use('/users', userRoute)

export const APIs = Router
