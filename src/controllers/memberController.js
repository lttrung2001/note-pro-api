import { StatusCodes } from "http-status-codes";
import memberServices from '../services/memberServices'

const addMember = async (req, res) => {
  try {
    const uid = req.user.uid
    const noteId = req.query.noteId
    const { email, role } = req.body
    const addMemberResult = await memberServices.addMember(noteId, email, role, uid)
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

const editMember = async (req, res) => {
  try {
    const uid = req.user.uid
    const { noteId, memberId } = req.query
    const { role } = req.body
    const editMemberResult = await memberServices.editMember(noteId, memberId, role, uid)
    res.status(editMemberResult.code).json({
      message: editMemberResult.message,
      data: editMemberResult.data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

const deleteMember = async (req, res) => {
  try {
    const uid = req.user.uid
    const { noteId, memberId } = req.query
    const deleteMemberResult = await memberServices.deleteMember(noteId, memberId, uid)
    res.status(deleteMemberResult.code).json({
      message: deleteMemberResult.message,
      data: deleteMemberResult.data
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message
    })
  }
}

const getMembers = async (req, res) => {
  try {
    const { noteId, pageIndex, limit } = req.query
    const getMembersResult = await memberServices.getMembers(noteId, pageIndex, limit);
    res.status(getMembersResult.code).json({
      message: getMembersResult.message,
      data: getMembersResult.data
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
    const getMemberDetailsResult = await memberServices.getMemberDetails(noteId, memberId);
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

export default {
  addMember,
  editMember,
  deleteMember,
  getMembers,
  getMemberDetails,
}
