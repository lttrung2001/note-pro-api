const { firestore, storage } = require('../../configs/firestoreConfig')
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage')

const addNoteService = async (uid, noteData, files) => {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch()
    const newNoteRef = firestore.collection('Note').doc()
    const memberCollectionRef = newNoteRef.collection('Member')
    batch.create(newNoteRef, {
        title: noteData.title,
        content: noteData.content,
        lastModified: Date.now()
    })
    batch.create(memberCollectionRef.doc(), {
        userId: uid,
        role: 'owner',
        isPin: noteData.isPin
    })
    if (files && files.images) {
        const imageCollectionRef = newNoteRef.collection('Image')
        const uploadImagePromises = []
        const imageUrl = null
        for (const image of [].concat(files.images)) {
            imageUrl = `images/${uid}/${newNoteRef.id}/${Date.now().toString()}-${image.name}`
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
                uploadTime: Date.parse(uploadResult.metadata.timeCreated)
            }
        })
        imagesData.forEach((imageData) => {
            batch.create(imageCollectionRef.doc(), imageData)
        })
    }
    await batch.commit()
    return {
        id: newNoteRef.id,
        title: noteData.title,
        content: noteData.content,
        isPin: noteData.isPin,
    }
}

const uploadImage = async (ref, image) => {
    return uploadBytes(ref, image.data, {
        contentType: 'image'
    })
}

module.exports = addNoteService