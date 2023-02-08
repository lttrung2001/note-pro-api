import { firestore } from "../../configs/firestoreConfig";
import { StatusCodes } from "http-status-codes";

const getImagesService = async (noteId, pageIndex, limit) => {
  if (!(noteId && pageIndex && limit)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Note Id, Page Index and Limit required."
    );
  } else if (pageIndex < 0) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Page Index must be equal or greater than 0."
    );
  } else if (limit <= 0) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Limit must be greater than 0."
    );
  }
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const images = (
      await noteRef
        .collection("images")
        .orderBy("uploadTime")
        .offset(pageIndex * limit)
        .limit(limit)
        .get()
    ).docs.map((image) => {
      return {
        id: image.id,
        ...image.data(),
      };
    });
    return new ServiceResult(
      StatusCodes.OK,
      "Get images successfully.",
      images
    );
  } catch (error) {
    throw new Error('Get images failed.')
  }
};

module.exports = getImagesService;
