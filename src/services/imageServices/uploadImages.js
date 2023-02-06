import { storage } from '../../configs/firestoreConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Image } from '../../models/models'
const uploadImages = async (images, uid) => {
    const uploadImagesPromises = []
    const imageUrl = null
    for (const image of [].concat(images)) {
        imageUrl = `images/${member.id}/${newNoteRef.id}/${Date.now().toString()}-${image.name}`
        uploadImagesPromises.push(
            uploadBytes(ref(storage, imageUrl),image.data, { contentType: 'image' })
        )
    }
    const imagesPromises = (await Promise.all(uploadImagesPromises)).map(async function (uploadResult) {
        return new Image(
            null,
            uploadResult.ref.name,
            await getDownloadURL(uploadResult.ref),
            Date.parse(uploadResult.metadata.timeCreated),
            uid
        )
    })
    return imagesPromises
}

module.exports = uploadImages