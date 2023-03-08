import { StatusCodes } from "http-status-codes";
import { adminAuth } from "../configs/firestoreConfig";
import memberServices from "../services/memberServices";
import { Member } from "../models/models";

const addMember = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { noteId } = req.query;
    const { email, role } = req.body;
    if (!(noteId && email, role)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "Note ID, email and role required.",
      });
    }
    const user = await adminAuth.getUserByEmail(email);
    if (!user.emailVerified) {
      res.status(StatusCodes.FORBIDDEN).json({
        message: "This user haven't verify email yet.",
      });
    }
    const member = new Member(null, role, false, uid);
    const addMemberResult = await memberServices.addMember(noteId, member);
    res.status(StatusCodes.OK).json({
      message: "Add member successfully.",
      data: addMemberResult,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const editMember = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { noteId, memberId } = req.query;
    const { role } = req.body;
    if (!(noteId && memberId && role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    } else if (!["owner", "editor", "viewer"].includes(role)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid role.",
      });
    }
    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    if (currentMember.role != "owner") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      });
    }
    let member = new Member(memberId, role, null, null);
    member = await memberServices.editMember(noteId, member);
    const user = await adminAuth.getUser(member.uid);
    return res.status(StatusCodes.OK).json({
      message: "Edit note successfully.",
      data: {
        id: member.id,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: member.role,
      },
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const deleteMember = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { noteId, memberId } = req.query;
    if (!(noteId && memberId && uid)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    if (currentMember.role != "owner") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      });
    }
    return res.status(StatusCodes.OK).json({
      message: "Delete member successfully.",
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getMembers = async (req, res) => {
  try {
    const { noteId, pageIndex, limit } = req.query;
    if (!(noteId && pageIndex >= 0 && limit > 0)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Inputs invalid.",
      });
    }
    const getMembersResult = await memberServices.getMembers(
      noteId,
      Number(pageIndex),
      Number(limit)
    );
    const promises = getMembersResult.data.map(async (member) => {
      const user = await adminAuth.getUser(member.uid);
      return {
        id: member.id,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: member.role,
      };
    });
    return res.status(StatusCodes.OK).json({
      message: "Get members successfully.",
      data: await Promise.all(promises),
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getMemberDetails = async (req, res) => {
  try {
    const { noteId, memberId } = req.query;
    if (!(noteId && memberId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const member = await memberServices.getMemberDetails(noteId, memberId);
    const user = await adminAuth.getUser(member.uid);
    res.status(StatusCodes.OK).json({
      id: member.id,
      fullName: user.displayName,
      phoneNumber: user.phoneNumber,
      email: user.email,
      role: member.role,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default {
  addMember,
  editMember,
  deleteMember,
  getMembers,
  getMemberDetails,
};
