import { StatusCodes } from "http-status-codes";
import { Member, Note } from "../models/models";
import noteServices from "../services/noteServices";
import memberServices from "../services/memberServices";

const addNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { title, content, isPin } = req.body;
    if (!(title || content || isPin != null)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const note = new Note(null, title, content, Date.now());
    const member = new Member(null, "owner", isPin, uid);
    const files = req.files;
    const data = await noteServices.addNote(note, member, files);
    return res.status(StatusCodes.OK).json({
      message: "Add note successfully.",
      data: data,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const editNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const { id } = req.query;
    const { title, content, isPin, deleteImageIds } = req.body;
    if (!(id && (title || content || isPin != null))) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const currentMember = await memberServices.getMemberDetailsByUid(id, uid);
    if (currentMember.role == "viewer") {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: "No permission.",
      });
    }
    currentMember.isPin = isPin;
    const note = new Note(id, title, content, Date.now());
    const files = req.files;

    const data = await noteServices.editNote(
      note,
      currentMember,
      files,
      deleteImageIds
    );
    res.status(StatusCodes.OK).json({
      message: "Edit note successfully.",
      data: data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const uid = req.user.uid;
    const noteId = req.query.id;
    if (!noteId) {
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

    // Call delete note service
    await noteServices.deleteNote(noteId, uid);

    res.status(StatusCodes.OK).json({
      message: "Delete note successfully.",
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getNoteDetails = async (req, res) => {
  try {
    const uid = req.user.uid;
    const noteId = req.query.id;
    if (!noteId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: StatusCodes.BAD_REQUEST,
        message: "Note ID and UID required to get note details.",
      });
    }
    const noteData = await noteServices.getNoteDetails(noteId);
    const member = await memberServices.getMemberDetailsByUid(noteId, uid);
    res.status(StatusCodes.OK).json({
      message: "Get note details successfully.",
      data: {
        id: noteData.id,
        title: noteData.title,
        content: noteData.content,
        lastModified: noteData.lastModified,
        images: noteData.images,
        isPin: member.isPin,
        role: member.role,
      },
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const uid = req.user.uid;
    const data = await noteServices.getNotes(uid);
    res.status(StatusCodes.OK).json({
      message: "Get notes successfully.",
      data: data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const searchNotes = async (req, res) => {
  try {
    const uid = req.user.uid;
    const keySearch = req.query.key;
    if (!keySearch) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs required.",
      });
    }
    const data = await noteServices.searchNotes(keySearch, uid);
    res.status(StatusCodes.OK).json({
      message: "Search notes successfully.",
      data: data,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export default {
  addNote,
  editNote,
  deleteNote,
  getNoteDetails,
  getNotes,
  searchNotes,
};
