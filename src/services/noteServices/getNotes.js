import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";

const getNotesService = async (uid) => {
  if (!uid) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "UID required."
    }
  }
  try {
    const querySnapshot = await firestore
      .collectionGroup("members")
      .where('uid','==',uid)
      .get();
    
    let data = querySnapshot.docs.map(async (document) => {
      const noteSnapshot = await document.ref.parent.parent.get()
      return {
        id: noteSnapshot.id,
        ...noteSnapshot.data(),
        ...document.data(),
      }
    });
    data = await Promise.all(data)

    return {
      code: StatusCodes.OK,
      message: "Get notes successfully.",
      data: data
    }
  } catch (error) {
    console.error(`Get notes error: ${error}`)
    throw new Error("Get notes failed.");
  }
};

module.exports = getNotesService;
