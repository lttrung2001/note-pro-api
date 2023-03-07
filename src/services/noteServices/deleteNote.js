import { firestore, storage } from "../../configs/firestoreConfig";
import { listAll, deleteObject, ref } from "firebase/storage";
import { StatusCodes } from "http-status-codes";
import getMemberDetailsByUid from "../memberServices/getMemberDetailsByUid";
const deleteNoteService = async (noteId, uid) => {
  if (!(noteId && uid)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and UID required to delete note.",
    };
  }
  try {
    // Call member service to get info of member
    const member = (await getMemberDetailsByUid(noteId, uid)).data;
    const canDelete = member.role == "owner" ? true : false;
    if (!canDelete) {
      return {
        code: StatusCodes.FORBIDDEN,
        message: "User does not have permission to delete note.",
      };
    }

    const noteRef = firestore.collection("notes").doc(noteId);
    await firestore.recursiveDelete(noteRef);

    const numberImages = (await noteRef.collection("images").get()).docs.length;
    if (numberImages > 0) {
      const listRef = ref(storage, `images/${uid}/${noteId}`);
      const result = await listAll(listRef);
      const deleteImagesPromises = [];
      result.items.forEach((itemRef) => {
        deleteImagesPromises.push(deleteObject(itemRef));
      });
      await Promise.all(deleteImagesPromises);
    }

    return {
      code: StatusCodes.OK,
      message: "Delete note successfully.",
    };
  } catch (error) {
    console.error(`Delete note error: ${error}`);
    throw new Error("Delete note failed.");
  }
};

export default deleteNoteService;
