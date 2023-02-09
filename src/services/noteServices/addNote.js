import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import uploadImagesService from "../imageServices/uploadImages";

const addNoteService = async (note, member, files) => {
  if (!(note.title || note.content || files)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "At least 1 input required to create new note."
    }
  } else if (!member.uid) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "UID required."
    }
  }
  try {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch();
    const newNoteRef = firestore.collection("notes").doc();
    const newMemberRef = newNoteRef.collection("members").doc()

    batch.create(newNoteRef, note.data());
    batch.create(newMemberRef, member.data());
    const imageCollectionRef = newNoteRef.collection("images");
    if (files && files.images) {
      const uploadImagesServiceResult = await uploadImagesService(
        member.uid,
        newNoteRef.id,
        files.images
      );
      if (uploadImagesServiceResult.code == StatusCodes.OK) {
        uploadImagesServiceResult.data.forEach((image) => {
          batch.create(imageCollectionRef.doc(), image.data());
        });
      }
    }
    
    await batch.commit();
    return {
      code: StatusCodes.OK,
      message: "Add note successfully.",
      data: {
        id: newNoteRef.id,
        title: note.title,
        content: note.content,
        lastModified: note.lastModified,
        isPin: member.isPin,
        role: member.role,
      }
    }
  } catch (error) {
    console.error(`Add note error: ${error}`)
    throw new Error("Add note failed.");
  }
};

module.exports = addNoteService;
