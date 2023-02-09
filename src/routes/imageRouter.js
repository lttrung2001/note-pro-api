import { Router } from 'express'
import imageController from '../controllers/imageController'
const imageRouter = () => {
    const router = Router()
    router.get('/get-images', imageController.getImages)
    router.delete('/delete-image', imageController.deleteImage)

    return router
}

module.exports = imageRouter