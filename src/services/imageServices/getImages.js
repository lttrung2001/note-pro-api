import { firestore } from '../../configs/firestoreConfig'
import { StatusCodes } from 'http-status-codes'

const getImagesService = async (noteId, pageIndex, limit) => {
    if (!(noteId && pageIndex && limit)) {
        return StatusCodes.BAD_REQUEST
    } else if (pageIndex < 0 && limit <= 0) {
        return StatusCodes.BAD_REQUEST
    }
    const noteRef = firestore.collection('notes').doc(noteId)
    const images = (await noteRef.collection('images')
        .orderBy('uploadTime')
        .offset(pageIndex * limit)
        .limit(limit)
        .get()).docs.map((image) => {
            return {
                id: image.id,
                ...image.data()
            }
        })
    return images
}

module.exports = getImagesService