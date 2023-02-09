import { StatusCodes } from "http-status-codes";
import addMemberService from '../services/memberServices/addMember'
import getMemberDetailsService from "../services/memberServices/getMemberDetails";

const addMember = async (req, res) => {
  try {
    const uid = req.user.uid
    const noteId = req.query.noteId
    const { email, role } = req.body
    const addMemberResult = await addMemberService(noteId, email, role, uid)
    res.status(addMemberResult.code).json({
      message: addMemberResult.message,
      data: addMemberResult.data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

const getMemberDetails = async (req, res) => {
  try {
    const noteId = req.query.noteId;
    const memberId = req.query.memberId;
    const getMemberDetailsResult = await getMemberDetailsService(noteId, memberId);
    res.status(getMemberDetailsResult.code).json({
      message: getMemberDetailsResult.message,
      data: getMemberDetailsResult.data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
};

module.exports = {
  addMember,
  getMemberDetails,
}
