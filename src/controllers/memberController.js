import { StatusCodes } from "http-status-codes";
import getMemberDetailsService from "../services/memberServices/getMemberDetails";
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
  getMemberDetails,
}
