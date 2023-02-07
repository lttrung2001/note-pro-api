import { Note } from '../../models/models'
import { firestore, storage } from '../../configs/firestoreConfig'
import { listAll, deleteObject, ref } from 'firebase/storage'
import getMemberRole from '../memberServices/getMemberRole'
const deleteNoteService = async (note, member) => {
    member.role = getMemberRole(member.id, note.id)
    const canDelete = member.role == 'owner' ? true : false
    if (!canDelete) {
        return null
    }

    const noteRef = firestore.collection('notes').doc(note.id)
    const noteSnapshot = await noteRef.get()
    const memberSnapshot = await noteRef.collection('members').doc(member.id).get()
    
    await noteRef.delete()

    const listRef = ref(storage, `images/${member.id}/${noteRef.id}`)
    const result = await listAll(listRef)
    const deleteImagesPromises = []
    result.items.forEach((itemRef) => {
        deleteImagesPromises.push(deleteObject(itemRef))
    })
    await Promise.all(deleteImagesPromises)

    return {
        id: noteRef.id,
        title: noteSnapshot.get('title'),
        content: noteSnapshot.get('content'),
        lastModified: noteSnapshot.get('lastModified'),
        isPin: memberSnapshot.get('isPin'),
        role: memberSnapshot.get('role')
    }
}

module.exports = deleteNoteService