import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import { ServiceResult } from "../../models/serviceResult";

const getNotesService = async (uid) => {
  if (!uid) {
    return new ServiceResult(StatusCodes.BAD_REQUEST, "UID required.");
  }
  try {
    const querySnapshot = firestore
      .collectionGroup("members")
      .where("id", "==", uid)
      .get();

    const data = (await querySnapshot).docs.map(async (document) => {
      const noteSnapshot = await document.ref.parent.parent.get();
      return new ServiceResult(StatusCodes.OK, "Get notes successfully.", {
        id: noteSnapshot.id,
        ...noteSnapshot.data(),
        ...document.data(),
      });
    });

    return new ServiceResult(StatusCodes.OK, "Get notes successfully.", data);
  } catch (error) {
    throw new Error("Get notes failed.");
  }
};

module.exports = getNotesService;
