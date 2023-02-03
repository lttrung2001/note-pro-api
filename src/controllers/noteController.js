const HttpStatusCode = require("../utils/HttpStatusCode")
const addNoteService = require('../services/noteServices/addNote')

const addNote = async (req, res) => {
    const uid = req.user.uid
    // Note data includes title, content, isPin
    const noteData = req.body
    // Check at least 1 input required
    if (!(noteData.title || noteData.content || req.files)) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: 'At least 1 input required.',
            data: null
        })
    } 
    try {
        // Call service
        const data = await addNoteService(uid, noteData, req.files)
        res.status(HttpStatusCode.OK).json({
            message: 'Add note successfully.',
            data: data
        })
    } catch (error) {
        console.log(error.message)
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Add note failed.',
            data: null
        })
    }
}

module.exports = {
    addNote
}