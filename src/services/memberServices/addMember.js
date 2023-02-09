import { StatusCodes } from "http-status-codes";
import { adminAuth, firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";

const addMemberService = async (noteId, email, role) => {
  if (!(noteId && email && role)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID, email and role required.",
    };
  }
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    if (!userRecord.emailVerified) {
      return {
        code: StatusCodes.FORBIDDEN,
        message: "This user haven't verify email yet.",
      };
    }
    const member = new Member(null, role, false, userRecord.uid);
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc();
    await memberRef.create(member.data());
    const memberSnapshot = await memberRef.get();
    return {
      code: StatusCodes.OK,
      message: "Add member successfully.",
      data: {
        id: memberSnapshot.id,
        role: memberSnapshot.get("role"),
        fullName: userRecord.displayName,
        email: userRecord.email,
      },
    };
  } catch (error) {
    console.log(`Add member error: ${error}`);
    throw new Error("Add member failed.");
  }
};

module.exports = addMemberService
