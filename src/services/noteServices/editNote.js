import { firestore } from '../../configs/firestoreConfig'

const editNoteService = async(uid, noteData) => {
    const noteRef = firestore.collection('notes').doc(noteData.id)
    const memberRef = noteRef.collection('members').doc(uid)

    noteData.lastModified = Date.now()

    const editNotePromise =  noteRef.update({
        title: noteData.title,
        content: noteData.content,
        lastModified: noteData.lastModified,
    })

    const updatePinStatusPromise = memberRef.update({
        isPin: noteData.isPin
    })

    await Promise.all([
        editNotePromise,
        updatePinStatusPromise
    ])

    const memberSnapshot = await memberRef.get()

    return {
        id: noteData.id,
        title: noteData.title,
        content: noteData.content,
        lastModified: noteData.lastModified,
        isPin: memberSnapshot.get('isPin')
    }
}

module.exports = editNoteService