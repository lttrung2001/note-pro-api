const HttpStatusCode = require("../../utils/HttpStatusCode")
const { firestore, storage } = require('../../configs/firestoreConfig')
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage')
const { map } = require("@firebase/util")

const addNoteService = async (req, res) => {
    const uid = req.user.uid
    const requestNote = req.body
    // Check at least 1 input required
    if (!(requestNote.title || requestNote.content || req.files)) {
        res.status(HttpStatusCode.BAD_REQUEST).json({
            message: 'At least 1 input required.',
            data: null
        })
    }
    try {
        const batch = firestore.batch()
        const newNoteReference = firestore.collection('Note').doc()
        const ownerReference = firestore.collection('Member').doc()
        batch.create(newNoteReference, {
            title: requestNote.title,
            content: requestNote.content
        })
        batch.create(ownerReference, {
            userId: uid,
            noteId: newNoteReference.id,
            role: 'owner',
            isPin: requestNote.isPin
        })
        // if (req.files.images) {
        //     const uploadImagePromises = []
        //     const url = null
        //     for (const image of [].concat(req.files.images)) {
        //         url = `images/${uid}/${noteId}/${imageId}`
        //         uploadImagePromises.push(
        //             uploadImage(
        //                 ref(storage, url),
        //                 image
        //             )
        //         )
        //     }
        //     const urls = (await Promise.all(uploadImagePromises)).map((uploadResult) => getDownloadURL(uploadResult.ref))
        // }
        batch.commit()
        res.status(HttpStatusCode.OK).json({
            message: 'Add note successfully.',
            data: null
        })
    } catch (error) {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
            message: 'Add note failed.',
            data: null
        })
    }
}

const uploadImage = async (ref, image) => {
    return uploadBytes(ref, image.data, {
        contentType: 'image'
    })
}

module.exports = addNoteService