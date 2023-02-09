import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";

const editNoteService = async (note, member, files) => {
  if (!note.id || !(note.title || note.content || files)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and at least 1 input required to edit note."
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
