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
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Note ID, email and role required.",
      });
    }
    const user = await adminAuth.getUserByEmail(email);
    if (user.uid == uid) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "You can not add yourself.",
      });
    }
    if (!user.emailVerified) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "This user haven't verify email yet.",
      });
    }
    let member = await memberServices.getMemberDetailsByUid(noteId, user.uid);
    if (member != null) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "This member already exists.",
      });
    }
    member = new Member(null, role, false, user.uid);
    const addMemberResult = await memberServices.addMember(noteId, member);
    res.status(StatusCodes.OK).json({
      message: "Add member successfully.",
      data: {
        id: addMemberResult.id,
        role: addMemberResult.role,
        fullName: user.displayName,
        phoneNumber: user.phoneNumber,
        email: user.email,
      },
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
    const { role, isPin } = req.body;
    if (!(noteId && memberId && role) || isPin === undefined) {
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
    const isOwner = currentMember.role == "owner";
    let member = null;
    if (isOwner) {
      member = new Member(memberId, role, null, null); 
      member = await memberServices.editMember(noteId, member);
    } else {
      member = new Member(currentMember.id, null, isPin, null); 
      member = await memberServices.editMember(noteId, member);
    }
    
    const user = await adminAuth.getUser(member.uid);
    return res.status(StatusCodes.OK).json({
      message: "Edit member successfully.",
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
    if (!(noteId && memberId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const currentMember = await memberServices.getMemberDetailsByUid(
      noteId,
      uid
    );
    const deletingMember = await memberServices.getMemberDetails(noteId, memberId);
    const isOwner = currentMember.role == "owner";
    if (isOwner && currentMember.role == deletingMember.role) {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "Owner can not be deleted.",
      });
    }
    if (isOwner) {
      await memberServices.deleteMember(noteId, memberId);
    } else {
      await memberServices.deleteMember(noteId, currentMember.id);
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
    const result = await memberServices.getMembers(
      noteId,
      Number(pageIndex),
      Number(limit)
    );
    const promises = result.data.map(async (member) => {
      const user = await adminAuth.getUser(member.uid);
      return {
        id: member.id,
        fullName: user.displayName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: member.role,
      };
    });
    result.data = await Promise.all(promises);
    return res.status(StatusCodes.OK).json({
      message: "Get members successfully.",
      data: result,
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
