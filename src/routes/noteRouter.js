import { Router } from 'express'
import noteController from '../controllers/noteController'

const userRouter = () => {
    const router = Router()
    router.post('/add-note', noteController.addNote)
    
    return router
}

module.exports = userRouter