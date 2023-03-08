const { firestore } = require("../../configs/firestoreConfig");

const searchNotesService = async (keySearch, uid) => {
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

    return notes;
  } catch (error) {
    console.error(`Search notes error: ${error}`);
    throw new Error("Search notes failed.");
  }
};

module.exports = searchNotesService;
