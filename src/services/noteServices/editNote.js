import { firestore } from '../../configs/firestoreConfig'
import getMemberRole from '../memberServices/getMemberRole'

const editNoteService = async(note, member) => {
    member.role = getMemberRole(member.id, note.id)
    const canEdit = member.role == 'owner' || member.role == 'editor' ? true : false
    if (!canEdit) {
        return null
    }
    const noteRef = firestore.collection('notes').doc(note.id)
    const memberRef = noteRef.collection('members').doc(member.id)

    const batch = firestore.batch()
    batch.update(noteRef, note.data())
    batch.update(memberRef, member.data())
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