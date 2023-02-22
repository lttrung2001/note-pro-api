import { StatusCodes } from "http-status-codes";
import { adminAuth, firestore } from "../../configs/firestoreConfig";
const getMembersService = async (noteId, pageIndex, limit) => {
  if (!(noteId && pageIndex && limit)) {
    return {
      code: StatusCodes.BAD_REQUEST,
      message: "Note ID, Page Index and Limit required.",
    };
  }
  try {
    const membersCollectionRef = firestore
      .collection("notes")
      .doc(noteId)
      .collection("members");
    const lastPageIndex =
      Math.ceil((await membersCollectionRef.get()).size / limit) - 1;
    const hasPreviousPage = pageIndex > 0;
    const hasNextPage = pageIndex < lastPageIndex;
    const promises = (
      await membersCollectionRef
        .offset(pageIndex * limit)
        .limit(limit)
        .get()
    ).docs.map(async (document) => {
      const uid = document.get("uid");
      const userRecord = await adminAuth.getUser(uid);
      return {
        id: document.id,
        role: document.get("role"),
        fullName: userRecord.displayName,
        email: userRecord.email,
        phoneNumber: userRecord.phoneNumber
      };
    });
    const members = await Promise.all(promises);
    return {
      code: StatusCodes.OK,
      message: "Get members successfully.",
      data: {
        hasPreviousPage: hasPreviousPage,
        hasNextPage: hasNextPage,
        data: members,
      },
    };
  } catch (error) {
    console.error(`Get members error: ${error}`);
    throw new Error("Get members failed.");
  }
};

export default getMembersService
