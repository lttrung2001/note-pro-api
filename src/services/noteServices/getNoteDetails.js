import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import { ServiceResult } from "../../models/serviceResult";
import getImages from "../imageServices/getImages";

const getNoteDetailsService = async (noteId, memberId) => {
  if (!(noteId && memberId)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Note ID and member ID required to get note details."
    );
  }
  try {
    const noteRef = firestore.collection("notes").doc(noteId);
    const [noteSnapshot, memberSnapshot, images] = await Promise.all([
      noteRef.get(),
      noteRef.collection("members").doc(memberId).get(),
      getImages(noteId, 0, 5),
    ]);
    const noteDetails = {
      id: noteRef.id,
      ...noteSnapshot.data(),
      ...memberSnapshot.data(),
      images: images,
    };
    return new ServiceResult(
      StatusCodes.OK,
      "Get note details successfully.",
      noteDetails
    );
  } catch (error) {
    throw new Error("Get note details failed.");
  }
};

module.exports = getNoteDetailsService
