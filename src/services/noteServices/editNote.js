import { firestore } from '../../configs/firestoreConfig'

const editNoteService = async(note, member) => {
    const noteRef = firestore.collection('notes').doc(note.id)
    const memberRef = noteRef.collection('members').doc(member.id)

    const batch = firestore.batch()
    batch.update(noteRef, {
        title: note.title,
        content: note.content,
        lastModified: note.lastModified,
    })
    batch.update(memberRef, {
        isPin: member.isPin
    })
    await batch.commit()

    return {
        id: note.id,
        title: note.title,
        content: note.content,
        lastModified: note.lastModified,
        isPin: member.isPin,
        role: member.role
    }
}

module.exports = editNoteService