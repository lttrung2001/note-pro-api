import { firestore } from "../../configs/firestoreConfig";
import getImagesService from "../imageServices/getImages";

const getNoteDetailsService = async (noteId) => {
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const [noteSnapshot, images] = await Promise.all([
      noteRef.get(),
      getImagesService(noteId, 0, 10),
    ]);

    const noteDetails = {
      id: noteSnapshot.id,
      ...noteSnapshot.data(),
      images: images,
    };
    return noteDetails;
  } catch (error) {
    console.error(`Get note details error: ${error}`);
    throw new Error("Get note details failed.");
  }
};

export default getNoteDetailsService;
