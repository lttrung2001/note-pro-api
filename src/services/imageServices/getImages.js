import { firestore } from "../../configs/firestoreConfig";
import { StatusCodes } from "http-status-codes";

const getImagesService = async (noteId, pageIndex, limit) => {
  if (!noteId) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note Id required."
    }
  } else if (pageIndex < 0) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Page Index must be equal or greater than 0."
    }
  } else if (limit <= 0) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Limit must be greater than 0."
    }
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
    return {
      code: StatusCodes.OK,
      message: "Get images successfully.",
      data: images
    }
  } catch (error) {
    console.error(`Get images error: ${error}`)
    throw new Error('Get images failed.')
  }
};

module.exports = getImagesService;
