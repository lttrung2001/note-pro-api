import { Router } from 'express'
import noteController from '../controllers/noteController'
import { checkAccessToken } from "../middleware/JWT";

const userRouter = () => {
    const router = Router()
    router.post('/add-note', checkAccessToken, noteController.addNote)
    router.put('/edit-note', checkAccessToken, noteController.editNote)
    router.delete('/delete-note', checkAccessToken,checkAccessToken, noteController.deleteNote)
    router.get('/get-note-details', checkAccessToken, noteController.getNoteDetails)
    router.get('/get-notes', checkAccessToken, noteController.getNotes)
    router.get('/search-notes', checkAccessToken, noteController.searchNotes)
    
    return router
}

module.exports = userRouter