import express from 'express'
import { authRoute } from './authRoute'
import { userRoute } from './userRoute'
import { chatRoute } from './chatRoute'

const Router = express.Router()

//Authentication
Router.use('/auth', authRoute)

//Users
Router.use('/users', userRoute)

//Chat
Router.use('/chat', chatRoute)

export const APIs = Router
