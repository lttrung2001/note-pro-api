import { storage } from '../../configs/firestoreConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Image } from '../../models/models'
const uploadImages = async (uid, noteId, images) => {
    const uploadImagesPromises = []
    const imageUrl = null
    for (const image of [].concat(images)) {
        imageUrl = `images/${uid}/${noteId}/${Date.now().toString()}-${image.name}`
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
    const images = await Promise.all(imagesPromises)
    return images
}

module.exports = uploadImages