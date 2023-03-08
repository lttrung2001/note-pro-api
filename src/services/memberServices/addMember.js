import { firestore } from "../../configs/firestoreConfig";
const addMemberService = async (noteId, member) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc();
    await memberRef.create(member.data());
    const memberSnapshot = await memberRef.get();
    return {
      id: memberSnapshot.id,
      ...memberSnapshot.data(),
    };
  } catch (error) {
    console.log(`Add member error: ${error}`);
    throw new Error("Add member failed.");
  }
};

export default addMemberService;
