import { firestore, storage } from '../../configs/firestoreConfig'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

const addNoteService = async (note, member, files) => {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch()
    const newNoteRef = firestore.collection('notes').doc()
    const memberCollectionRef = newNoteRef.collection('members')

    batch.create(newNoteRef, note.data())
    batch.create(memberCollectionRef.doc(member.id), member.data())
    if (files && files.images) {
        const imageCollectionRef = newNoteRef.collection('images')
        const uploadImagePromises = []
        const imageUrl = null
        for (const image of [].concat(files.images)) {
            imageUrl = `images/${member.id}/${newNoteRef.id}/${Date.now().toString()}-${image.name}`
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
        title: note.title,
        content: note.content,
        lastModified: note.lastModified,
        isPin: member.isPin,
        role: member.role
    }
}

const uploadImage = async (ref, image) => {
    return uploadBytes(ref, image.data, {
        contentType: 'image'
    })
}

module.exports = addNoteService