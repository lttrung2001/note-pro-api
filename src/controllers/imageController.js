import getImagesService from "../services/imageServices/getImages";
const getImages = async (req, res) => {
  const { noteId, pageIndex, limit } = req.query;
  const serviceResult = await getImagesService(noteId, pageIndex, limit);
  res.status(serviceResult.code).json(serviceResult.body());
};

module.exports = {
  getImages,
};
