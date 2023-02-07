import { firestore } from '../../configs/firestoreConfig'
import uploadImagesService from '../imageServices/uploadImages'

const addNoteService = async (note, member, files) => {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch()
    const newNoteRef = firestore.collection('notes').doc()
    const memberCollectionRef = newNoteRef.collection('members')

    batch.create(newNoteRef, note.data())
    batch.create(memberCollectionRef.doc(member.id), member.data())
    if (files && files.images) {
        const imageCollectionRef = newNoteRef.collection('images')
        const images = await uploadImagesService(member.id, newNoteRef.id, files.images)
        images.forEach((image) => {
            batch.create(imageCollectionRef.doc(), image.data())
        })
    }
    await batch.commit()
    return {
        id: newNoteRef.id,
        title: note.title,
        content: note.content,
        lastModified: note.lastModified,
        isPin: member.isPin,
        role: member.role
    }
}

module.exports = addNoteService