import { firestore } from "../../configs/firestoreConfig";

const editMemberService = async (noteId, member) => {
  try {
    const memberRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members")
      .doc(member.id);
    await memberRef.update({ role: member.role, isPin: member.isPin });
    const memberSnapshot = await memberRef.get();
    return {
      id: memberSnapshot.id,
      ...memberSnapshot.data(),
    };
  } catch (error) {
    console.error(`Edit member error: ${error}`);
    throw new Error("Edit member failed.");
  }
};

export default editMemberService;
