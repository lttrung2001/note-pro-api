import { StatusCodes } from 'http-status-codes'
import { Member, Note } from '../models/models'
import addNoteService from '../services/noteServices/addNote'
import editNoteService from '../services/noteServices/editNote'
import deleteNoteService from '../services/noteServices/deleteNote'

const addNote = async (req, res) => {
    try {
        const note = new Note(null, req.body.title, req.body.content, Date.now())
        const member = new Member(uid, 'owner', req.body.isPin)
        const files = req.files
        const addNoteServiceResult = await addNoteService(note, member, files)
        res.status(addNoteServiceResult.code).json(addNoteServiceResult.body())
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const editNote = async (req, res) => {
    try {
        const note = new Note(req.query.id, req.body.title, req.body.content, Date.now())
        const member = new Member(req.user.uid, null, req.body.isPin)
        const files = req.files
        
        const editNoteServiceResult = await editNoteService(note, member, files)
        res.status(editNoteServiceResult.code).json(editNoteServiceResult.body())
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}

const deleteNote = async (req, res) => {
    try {
        const noteId = req.query.noteId
        const memberId = req.user.uid
        const deleteNoteServiceResult = await deleteNoteService(noteId, memberId)
        res.status(deleteNoteServiceResult.code).json(deleteNoteServiceResult.body())
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

module.exports = {
    addNote,
    editNote,
    deleteNote
}