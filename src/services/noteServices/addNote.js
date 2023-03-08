import { firestore } from "../../configs/firestoreConfig";
import uploadImagesService from "../imageServices/uploadImages";

const addNoteService = async (note, member, files) => {
  try {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch();
    const newNoteRef = firestore.collection("notes").doc();
    const newMemberRef = newNoteRef.collection("members").doc();

    batch.create(newNoteRef, note.data());
    batch.create(newMemberRef, member.data());
    const imageCollectionRef = newNoteRef.collection("images");
    if (files && files.images) {
      const images = await uploadImagesService(
        member.uid,
        newNoteRef.id,
        files.images
      );
      if (images) {
        images.forEach((image) => {
          batch.create(imageCollectionRef.doc(), image.data());
        });
      }
    }

    await batch.commit();
    return {
      id: newNoteRef.id,
      title: note.title,
      content: note.content,
      lastModified: note.lastModified,
      isPin: member.isPin,
      role: member.role,
    };
  } catch (error) {
    console.error(`Add note error: ${error}`);
    throw new Error("Add note failed.");
  }
};

export default addNoteService;
