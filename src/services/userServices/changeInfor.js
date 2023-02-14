import { StatusCodes } from "http-status-codes";
import { adminAuth } from "../../configs/firestoreConfig";

const changeInforService = async (userInput) => {
  try {
    let newUser = await adminAuth.updateUser(userInput.uid, userInput);
    if (newUser) {
      return {
        message: "User updated successfully",
        code: StatusCodes.OK,
      };
    } else {
      return {
        message: "User updated failed",
        code: StatusCodes.BAD_GATEWAY,
      };
    }
  } catch (error) {
    console.log("error change infor", error.message);
  }
};

module.exports = changeInforService;
