import { firestore, storage } from "../../configs/firestoreConfig";
import { listAll, deleteObject, ref } from "firebase/storage";
import { StatusCodes } from "http-status-codes";
import { ServiceResult } from '../../models/serviceResult'
const deleteNoteService = async (noteId, memberId) => {
  if (!(noteId && memberId)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Note ID and member ID required to delete note."
    );
  }
  try {
    // Call member service to get info of member
    //   const member = await ...
    const canDelete = member.role == "owner" ? true : false;
    if (!canDelete) {
      return new ServiceResult(
        StatusCodes.FORBIDDEN,
        "User does not have permission to delete note."
      );
    }

    const noteRef = firestore.collection("notes").doc(noteId);
    await firestore.recursiveDelete(noteRef);

    const numberImages = (await noteRef.collection("images").get()).docs.length;
    if (numberImages > 0) {
      const listRef = ref(storage, `images/${member.id}/${noteRef.id}`);
      const result = await listAll(listRef);
      const deleteImagesPromises = [];
      result.items.forEach((itemRef) => {
        deleteImagesPromises.push(deleteObject(itemRef));
      });
      await Promise.all(deleteImagesPromises);
    }

    return new ServiceResult(
        StatusCodes.OK,
        "Delete note successfully."
    )
  } catch (error) {
    throw new Error("Delete note failed.")
  }
};

module.exports = deleteNoteService;
