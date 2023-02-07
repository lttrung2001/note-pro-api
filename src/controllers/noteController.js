import { StatusCodes } from 'http-status-codes'
import { Member, Note } from '../models/models'
import addNoteService from '../services/noteServices/addNote'
import editNoteService from '../services/noteServices/editNote'

const addNote = async (req, res) => {
    const uid = req.user.uid
    // Note data includes title, content, isPin
    const note = new Note(null, req.body.title, req.body.content, Date.now())
    const member = new Member(uid, 'owner', req.body.isPin)
    // Check at least 1 input required
    if (!(note.title || note.content || req.files)) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'At least 1 input required.',
            data: null
        })
    } 
    try {
        // Call service
        const data = await addNoteService(note, member, req.files)
        res.status(StatusCodes.OK).json({
            message: 'Add note successfully.',
            data: data
        })
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Add note failed.',
            data: null
        })
    }
}

const editNote = async (req, res) => {
    try {
        const uid = req.user.uid
        const note = new Note(req.query.id, req.body.title, req.body.content, Date.now())

        if (!note.id || !(note.title || note.content || req.files)) {
            res.status(StatusCodes.BAD_REQUEST).json({
                message: 'Id and at least 1 input for note required.',
                data: null
            })
        }
        
        const member = new Member(uid, null, req.body.isPin)

        const data = await editNoteService(note, member)

        if (data == null) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'User does not have permission.',
                data: null
            })
        }

        res.status(StatusCodes.OK).json({
            message: 'Edit note successfully.',
            data: data
        })
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Edit note failed.',
            data: null
        })
    }
}

module.exports = {
    addNote,
    editNote
}