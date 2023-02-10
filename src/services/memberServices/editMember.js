import { StatusCodes } from "http-status-codes";
import { adminAuth, firestore } from "../../configs/firestoreConfig";

const editMemberService = async (noteId, memberId, role, uid) => {
  if (!(noteId && memberId && role)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID, member ID and role required.",
    };
  }
  if (!["owner", "editor", "viewer"].includes(role)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Invalid role.",
    };
  }
  try {
    const canEdit =
      (
        await firestore
          .collection("notes")
          .doc(noteId)
          .collection("members")
          .where("uid", "==", uid)
          .limit(1)
          .get()
      ).docs[0].get("role") == "owner"
        ? true
        : false;
    if (!canEdit) {
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
    await memberRef.update({ role: role });
    const memberSnapshot = await memberRef.get();
    const userRecord = await adminAuth.getUser(memberSnapshot.get("uid"));
    return {
      code: StatusCodes.OK,
      message: "Edit member successfully.",
      data: {
        id: memberSnapshot.id,
        role: memberSnapshot.get("role"),
        fullName: userRecord.displayName,
        email: userRecord.email,
      },
    };
  } catch (error) {
    console.error(`Edit member error: ${error}`);
    throw new Error("Edit member failed.");
  }
};

module.exports = editMemberService