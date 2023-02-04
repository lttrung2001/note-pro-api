import { firestore } from '../../configs/firestoreConfig'

const editNoteService = async(uid, noteData) => {
    const noteRef = firestore.collection('notes').doc(noteData.id)
    const memberRef = noteRef.collection('members').doc(uid)

    noteData.lastModified = Date.now()

    const batch = firestore.batch()
    batch.update(noteRef, {
        title: noteData.title,
        content: noteData.content,
        lastModified: noteData.lastModified,
    })
    batch.update(memberRef, {
        isPin: noteData.isPin
    })
    await batch.commit()

    return {
        id: noteData.id,
        title: noteData.title,
        content: noteData.content,
        lastModified: noteData.lastModified,
        isPin: noteData.isPin
    }
}

module.exports = editNoteService