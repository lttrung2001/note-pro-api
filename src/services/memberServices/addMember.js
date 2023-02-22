import { StatusCodes } from "http-status-codes";
import { adminAuth, firestore } from "../../configs/firestoreConfig";
import { Member } from "../../models/models";

const addMemberService = async (noteId, email, role, uid) => {
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
    const canAddMember =
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
    if (!canAddMember) {
      return {
        code: StatusCodes.FORBIDDEN,
        message: "User does not have permission to add new member.",
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
        phoneNumber: userRecord.phoneNumber
      },
    };
  } catch (error) {
    console.log(`Add member error: ${error}`);
    throw new Error("Add member failed.");
  }
};

export default addMemberService;
