const { StatusCodes } = require("http-status-codes");
const { firestore } = require("../../configs/firestoreConfig");

const searchNotesService = async (keySearch, uid) => {
  if (!uid) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "UID required.",
    };
  }
  if (!keySearch.trim()) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Key search required.",
    };
  }
  try {
    const querySnapshot = await firestore
      .collectionGroup("members")
      .where("uid", "==", uid)
      .get();
    const notePromises = querySnapshot.docs.map(async (document) => {
      const noteSnapshot = await document.ref.parent.parent.get();
      const result = {
        id: noteSnapshot.id,
        ...noteSnapshot.data(),
        ...document.data(),
      };
      delete result.uid;

      return result;
    });

    let notes = await Promise.all(notePromises);
    notes = notes.filter((note) => note.title.includes(keySearch));

    return {
      code: StatusCodes.OK,
      message: "Search notes successfully.",
      data: notes,
    };
  } catch (error) {
    console.error(`Search notes error: ${error}`);
    throw new Error("Search notes failed.");
  }
};

module.exports = searchNotesService;
