import { firestore, storage } from '../../configs/firestoreConfig'

const editNoteService = async(noteData) => {
    const noteRef = firestore.collection('notes').doc(noteData.id)
    await noteRef.update({
        title: noteData.title,
        content: noteData.content,
        lastModified: Date.now()
    })
    const noteSnapshot = await noteRef.get()
    return {
        id: noteSnapshot.id,
        title: noteSnapshot.get('title'),
        content: noteSnapshot.get('content'),
        lastModified: noteSnapshot.get('lastModified')
    }
}