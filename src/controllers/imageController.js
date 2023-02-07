import { StatusCodes } from 'http-status-codes'
import getImagesService from '../services/imageServices/getImages'
const getImages = async (req, res) => {
    const { noteId, pageIndex, limit } = req.query
    if (!(noteId && pageIndex && limit)) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'All input required.',
            data: null
        })
    } else if (pageIndex < 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Page index must be equal or greater than 0.',
            data: null
        })
    } else if (limit < 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: 'Limit must be greater than 0.',
            data: null
        })
    }
    try {
        const data = await getImagesService(noteId, pageIndex, limit)
        res.status(StatusCodes.OK).json({
            message: 'Get images successfully.',
            data: data
        })
    } catch (error) {
        console.log(error.message)
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: 'Get images failed.',
            data: null
        })
    }
}

module.exports = {
    getImages
}