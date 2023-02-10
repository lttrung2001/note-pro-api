import { deleteObject } from "firebase/storage";
import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import { ref, deleteObject } from 'firebase/storage'
import uploadImagesService from '../imageServices/uploadImages';

const editNoteService = async (note, member, files, deleteImageIds) => {
  if (!note.id) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID required."
    }
  }
  if (!(note.title || note.content || files || !deleteImageIds)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "At least 1 input required."
    }
  }
  try {
    // Call member service to get info of member
    // member = await ...
    const canEdit =
      member.role == "owner" || member.role == "editor" ? true : false;
    if (!canEdit) {
      return {
        code: StatusCodes.BAD_REQUEST,
        message: "User does not have permission to edit note."
      }
    }
    const noteRef = firestore.collection("notes").doc(note.id);
    const memberRef = (await noteRef.collection("members").where('uid','==',member.uid).limit(1).get()).docs[0].ref

    const batch = firestore.batch();
    batch.update(noteRef, note.data());
    batch.update(memberRef, member.data());
    const imageCollectionRef = noteRef.collection("images");
    if (deleteImageIds) {
      deleteImageIds.forEach(async (id) =>{
        const imageRef = imageCollectionRef.doc(id);
        const url = (await imageRef.get()).get('url');
        batch.delete(imageRef);
        deleteObject(ref(storage, url));
      })
    }
    if (files && files.images) {
      const uploadImagesServiceResult = await uploadImagesService(
        member.uid,
        noteRef.id,
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
      message: "Edit note successfully.",
      data: {
      id: note.id,
      title: note.title,
      content: note.content,
      lastModified: note.lastModified,
      isPin: member.isPin,
      role: member.role,
      }
    }
  } catch (error) {
    console.error(`Edit note error: ${error}`)
    throw new Error("Edit note failed.")
  }
};

module.exports = editNoteService;
