import { firestore } from "../../configs/firestoreConfig";

const getMemberDetailsByUidService = async (noteId, memberUid) => {
  try {
    const querySnapshot = firestore.collection("notes").doc(noteId).collection("members").where("uid", "==", memberUid).get();
    if (querySnapshot.size == 0) {
      throw new Error("Member doesn't exists.");
    }
    const memberSnapshot = (await querySnapshot).docs[0];
    return {
      id: memberSnapshot.id,
      ...memberSnapshot.data(),
    }
  } catch (error) {
    console.error(`Get member details by uid error: ${error}`);
    throw new Error("Get member details failed.");
  }
};

export default getMemberDetailsByUidService
