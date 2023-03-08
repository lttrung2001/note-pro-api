import { ref, deleteObject } from "firebase/storage";
import { firestore } from "../../configs/firestoreConfig";
import uploadImagesService from "../imageServices/uploadImages";

const editNoteService = async (note, member, files, deleteImageIds) => {
  try {
    const noteRef = firestore.collection("notes").doc(note.id);
    const memberRef = noteRef.collection("members").doc(member.id);
    const imageCollectionRef = noteRef.collection("images");

    const batch = firestore.batch();
    // Update note data
    batch.update(noteRef, note.data());
    // Update member data (isPin)
    batch.update(memberRef, { role: member.role });
    // Delete images
    if (deleteImageIds) {
      deleteImageIds.forEach(async (id) => {
        const imageRef = imageCollectionRef.doc(id);
        const url = (await imageRef.get()).get("url");
        batch.delete(imageRef);
        await deleteObject(ref(storage, url));
      });
    }
    // Add images
    if (files && files.images) {
      const images = await uploadImagesService(
        member.uid,
        noteRef.id,
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
      id: note.id,
      title: note.title,
      content: note.content,
      lastModified: note.lastModified,
      isPin: member.isPin,
      role: member.role,
    };
  } catch (error) {
    console.error(`Edit note error: ${error}`);
    throw new Error("Edit note failed.");
  }
};

export default editNoteService;
