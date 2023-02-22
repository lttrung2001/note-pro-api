import { Router } from 'express'
import noteController from '../controllers/noteController'
import middlewares from '../middlewares'

const router = Router()
router.post('/add-note', middlewares.verifyAccessToken, noteController.addNote)
router.put('/edit-note', middlewares.verifyAccessToken, noteController.editNote)
router.delete('/delete-note', middlewares.verifyAccessToken, noteController.deleteNote)
router.get('/get-note-details', middlewares.verifyAccessToken, noteController.getNoteDetails)
router.get('/get-notes', middlewares.verifyAccessToken, noteController.getNotes)
router.get('/search-notes', middlewares.verifyAccessToken, noteController.searchNotes)
    
export default router