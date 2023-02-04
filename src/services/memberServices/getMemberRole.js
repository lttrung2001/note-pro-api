import { firestore } from '../../configs/firestoreConfig'

const getMemberRole = async (uid, noteId) => {
    const member = await firestore.collection('notes').doc(noteId).collection('members').doc(uid).get()
    return member.exists ? member.get('role') : null
}

module.exports = getMemberRole