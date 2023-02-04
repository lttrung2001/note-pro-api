import { Router } from 'express'
import userController from '../controllers/userController'

const userRouter = () => {
    const router = Router()
    router.post('/register', userController.registerUser)
    
    return router
}

module.exports = userRouter