const { StatusCodes } = require("http-status-codes");
const { firestore } = require("../../configs/firestoreConfig");

const deleteMemberService = async (noteId, memberId, uid) => {
  if (!(noteId && memberId && uid)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and member ID required.",
    };
  }
  try {
    const canDelete =
      (
        await firestore
          .collection("notes")
          .doc(noteId)
          .collection("members")
          .where("uid", "==", uid)
          .get()
      ).docs[0].get("role") == "owner";
    if (!canDelete) {
      return {
        code: StatusCodes.FORBIDDEN,
        message: "User does not have permission.",
      };
    }
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc(memberId);
    await memberRef.delete();
    return {
      code: StatusCodes.OK,
      message: "Delete member successfully.",
    };
  } catch (error) {
    console.error(`Delete member error: ${error}`);
    throw new Error("Delete member failed.");
  }
};

export default deleteMemberService
