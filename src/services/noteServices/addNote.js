import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import { Member, Note } from "../../models/models";
import uploadImagesService from "../imageServices/uploadImages";

const addNoteService = async (note, member, files) => {
  if (!(note.title || note.content || files)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "At least 1 input required to create new note."
    );
  } else if (!member.id) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "UID required."
    );
  }
  try {
    // Batch using to write with atomic (transaction)
    const batch = firestore.batch();
    const newNoteRef = firestore.collection("notes").doc();
    const memberCollectionRef = newNoteRef.collection("members");

    const note = new Note(null, title, content, Date.now());
    const member = new Member(uid, "owner", isPin);

    batch.create(newNoteRef, note.data());
    batch.create(memberCollectionRef.doc(member.id), member.data());
    const imageCollectionRef = newNoteRef.collection("images");
    const uploadImagesServiceResult = await uploadImagesService(
      member.id,
      newNoteRef.id,
      files.images
    );
    if (uploadImagesServiceResult.code == StatusCodes.OK) {
      images.forEach((image) => {
        batch.create(imageCollectionRef.doc(), image.data());
      });
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
    throw new Error('Add note failed.')
  }
};

module.exports = addNoteService;
