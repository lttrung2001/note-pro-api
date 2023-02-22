import { StatusCodes } from "http-status-codes";
import { firestore, storage } from "../../configs/firestoreConfig";
import { ref, deleteObject } from 'firebase/storage'

const deleteImageService = async (noteId, imageId, uid) => {
  if (!(imageId && uid)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Image ID and UID required.",
    };
  }
  try {
    // Call member service to check permission
    // const member = await ...
    const imageRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("images")
      .doc(imageId);
    const url = await (await imageRef.get()).get('url')
    await imageRef.delete()
    await deleteObject(ref(storage, url))
    return {
        code: StatusCodes.OK,
        message: "Delete image successfully.",
    }
  } catch (error) {
    console.error(`Delete image error: ${error}`);
    throw new Error("Delete image failed.");
  }
};

module.exports = deleteImageService
