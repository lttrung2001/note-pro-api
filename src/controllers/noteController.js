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
        const uid = req.user.uid
        const note = new Note(req.query.id)
        const member = new Member(uid)

        if (!(note.id || member.id)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'All input required.',
                data: null
            })
        }
        
        const data = await deleteNoteService(note, member)

        if (data == null) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'User does not have permission.',
                data: null
            })
        } else {
            res.status(StatusCodes.OK).json({
                message: 'Delete note successfully.',
                data: data
            })
        }
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Delete note failed.',
            data: null
        })
    }
}

module.exports = {
    addNote,
    editNote,
    deleteNote
}