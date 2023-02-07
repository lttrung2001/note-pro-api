import { Router } from 'express'
import noteController from '../controllers/noteController'

const userRouter = () => {
    const router = Router()
    router.post('/add-note', noteController.addNote)
    router.put('/edit-note', noteController.editNote)
    router.delete('/delete-note', noteController.deleteNote)
    
    return router
}

module.exports = userRouter