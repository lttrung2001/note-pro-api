import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import getImagesService from "../imageServices/getImages";

const getNoteDetailsService = async (noteId, uid) => {
  if (!(noteId && uid)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and UID required to get note details."
    }
  }
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const [noteSnapshot, memberSnapshot, images] = await Promise.all([
      noteRef.get(),
      noteRef.collection("members").doc(uid).get(),
      getImagesService(noteId, 0, 5)
    ]);
    const noteDetails = {
      id: noteRef.id,
      ...noteSnapshot.data(),
      ...memberSnapshot.data(),
      images: images.data,
    };
    delete noteDetails.uid
    
    return {
      code: StatusCodes.OK,
      message: "Get note details successfully.",
      data: noteDetails
    }
  } catch (error) {
    console.error(`Get note details error: ${error}`)
    throw new Error("Get note details failed.");
  }
};

module.exports = getNoteDetailsService
