const { firestore } = require("../../configs/firestoreConfig");

const getMemberDetailsService = async (noteId, memberId) => {
  try {
    const memberSnapshot = await firestore.collection("notes").doc(noteId).collection("members").doc(memberId).get()
    return {
      id: memberSnapshot.id,
      ...memberSnapshot.data(),
    }
  } catch (error) {
    console.error(`Get member details error: ${error}`)
    throw new Error("Get member details failed.")
  }
};

export default getMemberDetailsService
