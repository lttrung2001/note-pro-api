const { StatusCodes } = require("http-status-codes");
const { firestore, adminAuth } = require("../../configs/firestoreConfig");

const getMemberDetailsService = async (noteId, memberId) => {
  if (!(noteId && memberId)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID and member ID required.",
    };
  }
  try {
    const memberSnapshot = await firestore.collection("notes").doc(noteId).collection("members").doc(memberId).get()
    const userRecord = await adminAuth.getUser(memberSnapshot.get('uid'))
    return {
      code: StatusCodes.OK,
      message: "Get member details successfully.",
      data: {
        id: memberSnapshot.id,
        role: memberSnapshot.get('role'),
        fullName: userRecord.displayName,
        email: userRecord.email,
        phoneNumber: userRecord.phoneNumber
      }
    }
  } catch (error) {
    console.error(`Get member details error: ${error}`)
    throw new Error("Get member details failed.")
  }
};

module.exports = getMemberDetailsService
