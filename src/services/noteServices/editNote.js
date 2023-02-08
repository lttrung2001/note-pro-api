import { StatusCodes } from "http-status-codes";
import { firestore } from "../../configs/firestoreConfig";
import getMemberRole from "../memberServices/getMemberRole";

const editNoteService = async (note, member, files) => {
  if (!note.id || !(note.title || note.content || files)) {
    return new ServiceResult(
      StatusCodes.BAD_REQUEST,
      "Note ID and at least 1 input required to edit note."
    );
  }
  try {
    // Call member service to get role
    member.role = getMemberRole(member.id, note.id);
    const canEdit =
      member.role == "owner" || member.role == "editor" ? true : false;
    if (!canEdit) {
      return new ServiceResult(
        StatusCodes.BAD_REQUEST,
        "User does not have permission to edit note."
      );
    }
    const noteRef = firestore.collection("notes").doc(note.id);
    const memberRef = noteRef.collection("members").doc(member.id);

    const batch = firestore.batch();
    batch.update(noteRef, note.data());
    batch.update(memberRef, member.data());
    await batch.commit();

    return new ServiceResult(StatusCodes.OK, "Edit note successfully.", {
      id: note.id,
      title: note.title,
      content: note.content,
      lastModified: note.lastModified,
      isPin: member.isPin,
      role: member.role,
    });
  } catch (error) {
    throw new Error("Edit note failed.")
  }
};

module.exports = editNoteService;
