import { firestore, storage } from "../../configs/firestoreConfig";
import { listAll, deleteObject, ref } from "firebase/storage";
const deleteNoteService = async (noteId, uid) => {
  try {
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

    return {};
  } catch (error) {
    console.error(`Delete note error: ${error}`);
    throw new Error("Delete note failed.");
  }
};

export default deleteNoteService;
