import { firestore } from "../../configs/firestoreConfig";

const getImagesService = async (noteId, pageIndex, limit) => {
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
    return images;
  } catch (error) {
    console.error(`Get images error: ${error}`);
    throw new Error("Get images failed.");
  }
};

module.exports = getImagesService;
