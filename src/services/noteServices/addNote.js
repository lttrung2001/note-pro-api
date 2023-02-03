const { firestore, storage } = require('../../configs/firestoreConfig')
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage')

const addNoteService = async (uid, noteData, files) => {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch()
    const newNoteReference = firestore.collection('Note').doc()
    const ownerReference = firestore.collection('Member').doc()
    batch.create(newNoteReference, {
        title: noteData.title,
        content: noteData.content
    })
    batch.create(ownerReference, {
        userId: uid,
        noteId: newNoteReference.id,
        role: 'owner',
        isPin: noteData.isPin
    })
    if (files && files.images) {
        const uploadImagePromises = []
        const imageUrl = null
        for (const image of [].concat(files.images)) {
            imageUrl = `images/${uid}/${newNoteReference.id}/${Date.now().toString()}-${image.name}`
            uploadImagePromises.push(
                uploadImage(
                    ref(storage, url),
                    image
                )
            )
        }
        const imagesData = (await Promise.all(uploadImagePromises)).map(async function (uploadResult) {
            return {
                name: uploadResult.ref.name,
                url: await getDownloadURL(uploadResult.ref),
                noteId: newNoteReference.id
            }
        })
        imagesData.forEach((imageData) => {
            batch.create(firestore.collection('Image').doc(), imageData)
        })
    }
    await batch.commit()
    return {}
}

const uploadImage = async (ref, image) => {
    return uploadBytes(ref, image.data, {
        contentType: 'image'
    })
}

module.exports = addNoteService