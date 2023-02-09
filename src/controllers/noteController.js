import { StatusCodes } from 'http-status-codes'
import { Member, Note } from '../models/models'
import addNoteService from '../services/noteServices/addNote'
import editNoteService from '../services/noteServices/editNote'
import deleteNoteService from '../services/noteServices/deleteNote'
import getNoteDetailsService from '../services/noteServices/getNoteDetails'
import getNotesService from '../services/noteServices/getNotes'

const addNote = async (req, res) => {
    try {
        const note = new Note(null, req.body.title, req.body.content, Date.now())
        const member = new Member(null, 'owner', req.body.isPin, 'req.user.uid')
        const files = req.files
        const addNoteServiceResult = await addNoteService(note, member, files)
        res.status(addNoteServiceResult.code).json({
            message: addNoteServiceResult.message,
            data: addNoteServiceResult.data
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const editNote = async (req, res) => {
    try {
        const note = new Note(req.query.id, req.body.title, req.body.content, Date.now())
        const member = new Member(null, null, req.body.isPin, 'req.user.uid')
        const files = req.files
        
        const editNoteServiceResult = await editNoteService(note, member, files)
        res.status(editNoteServiceResult.code).json({
            message: editNoteServiceResult.message,
            data: editNoteServiceResult.data
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message,
        })
    }
}

const deleteNote = async (req, res) => {
    try {
        const noteId = req.query.noteId
        const memberId = 'req.user.uid'
        const deleteNoteServiceResult = await deleteNoteService(noteId, memberId)
        res.status(deleteNoteServiceResult.code).json({
            message: deleteNoteServiceResult.message,
            data: deleteNoteServiceResult.data
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const getNoteDetails = async (req, res) => {
    try {
        const noteId = req.query.id
        const memberId = 'req.user.uid'
        const getNoteDetailsServiceResult = await getNoteDetailsService(noteId, memberId)
        res.status(getNoteDetailsServiceResult.code).json({
            message: getNoteDetailsServiceResult.message,
            data: getNoteDetailsServiceResult.data
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

const getNotes = async (req, res) => {
    try {
        const uid = 'req.user.uid'
        const getNotesServiceResult = await getNotesService(uid)
        res.status(getNotesServiceResult.code).json({
            message: getNotesServiceResult.message,
            data: getNotesServiceResult.data
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: error.message
        })
    }
}

module.exports = {
    addNote,
    editNote,
    deleteNote,
    getNoteDetails,
    getNotes
}