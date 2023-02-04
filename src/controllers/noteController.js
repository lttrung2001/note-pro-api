import { StatusCodes } from 'http-status-codes'
import { Member, Note } from '../models/models'
import getMemberRole from '../services/memberServices/getMemberRole'
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
        
        const memberRole = await getMemberRole(uid, note.id)
        const member = new Member(uid, memberRole, req.body.isPin)

        // Check role permission
        const canEdit = memberRole == 'owner' || memberRole == 'editor' ? true : false

        if (!canEdit) {
            res.status(StatusCodes.FORBIDDEN).json({
                message: 'User does not have permission.',
                data: null
            })
        }

        const data = await editNoteService(note, member)

        res.status(StatusCodes.OK).json({
            message: 'Edit note successfully',
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