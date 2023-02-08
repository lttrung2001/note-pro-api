import { StatusCodes } from "http-status-codes";
import getImagesService from "../services/imageServices/getImages";
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

module.exports = {
  getImages,
};
