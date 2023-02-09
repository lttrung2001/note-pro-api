import { Router } from 'express'
import noteController from '../controllers/noteController'

const userRouter = () => {
    const router = Router()
    router.post('/add-note', noteController.addNote)
    router.put('/edit-note', noteController.editNote)
    router.delete('/delete-note', noteController.deleteNote)
    router.get('/get-note-details', noteController.getNoteDetails)
    
    return router
}

module.exports = userRouter