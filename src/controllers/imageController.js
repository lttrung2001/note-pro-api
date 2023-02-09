import { StatusCodes } from "http-status-codes";
import getImagesService from "../services/imageServices/getImages";
import deleteImageService from "../services/imageServices/deleteImage";
const getImages = async (req, res) => {
  const { noteId, pageIndex, limit } = req.query;
  try {
    const serviceResult = await getImagesService(noteId, pageIndex, limit);
    res.status(serviceResult.code).json(serviceResult.body());
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
};

const deleteImage = async (req, res) => {
  const { noteId, imageId } = req.query
  const uid = req.user.uid
  try {
    const deleteImageServiceResult = await deleteImageService(noteId, imageId, uid)
    res.status(deleteImageServiceResult.code).json({
      message: deleteImageServiceResult.message,
      data: deleteImageServiceResult.data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

module.exports = {
  getImages,
  deleteImage
};
