import { StatusCodes } from "http-status-codes";
import { firestore, adminAuth } from "../../configs/firestoreConfig";

const getMemberDetailsByUidService = async (noteId, memberUid) => {
  if (!(noteId && memberUid)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and member UID required.",
    };
  }
  try {
    const [querySnapshot, userRecord] = await Promise.all([
      (await firestore.collection("notes").doc(noteId).collection("members").where("uid", "==", memberUid).get()),
      adminAuth.getUser(memberUid),
    ]);
    if (querySnapshot.size == 0) {
      return {
        code: StatusCodes.NOT_FOUND,
        message: "User does not exists."
      }
    }
    const memberSnapshot = querySnapshot.docs[0];
    return {
      code: StatusCodes.OK,
      message: "Get member details successfully.",
      data: {
        id: memberSnapshot.id,
        role: memberSnapshot.get("role"),
        fullName: userRecord.displayName,
        email: userRecord.email,
      },
    };
  } catch (error) {
    console.error(`Get member details by uid error: ${error}`);
    throw new Error("Get member details failed.");
  }
};

module.exports = getMemberDetailsByUidService
