import registerService from "../services/userServices/register";
import loginService from "../services/userServices/login";
import { changePasswordService } from "../services/userServices/changePassword";
import changeInforService from "../services/userServices/changeInfor";
import { StatusCodes } from "http-status-codes";

const registerUser = async (req, res) => {
  try {
    // Extract user information from the request body
    const newUser = req.body;

    // Validate that all inputs are provided
    if (!(newUser.email && newUser.password && newUser.fullName)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }
    // Call service
    await registerService(newUser);
    // Return success message
    res.status(StatusCodes.OK).json({
      message: "Create account successfully.",
      data: null,
    });
  } catch (error) {
    // Log error message
    console.error("Error creating new user:", error.message);

    // Return error message if email already exists
    res.status(StatusCodes.CONFLICT).json({
      message: "Email already exists.",
      data: null,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    // Extract user information from the request body
    const user = req.body;

    // Validate that all inputs are provided
    if (!(user.email && user.password && user.fullName)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }
    // Call service
    let data = await loginService(user);
    // Return success message

    if (data && data.code === StatusCodes.OK) {
      // Return success message
      return res.status(StatusCodes.OK).json({
        message: data.message,
        data: data.refreshToken,
      });
    } else if (data && data.code === StatusCodes.UNAUTHORIZED) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: data.message,
      });
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({
        message: data.message,
      });
    }
  } catch (error) {
    // Log error message
    console.error("Error login user:", error.message);
  }
};

const changePassword = async (req, res) => {
  try {
    // Extract user information from the request user
    const user = req.body;
    user.uid = req.user.uid;

    // Validate that all inputs are provided
    if (!(user && user.newPassword && user.oldPassword)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }

    // Call service
    let data = await changePasswordService(user);
    // Return success message
    if (data) {
      return res.status(data.code).json({
        message: data.message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Data null",
    });
  } catch (error) {
    // Log error message
    console.error("Error changePassword:", error.message);

    // Return error message
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Error from changePassword.",
      data: null,
    });
  }
};

const changeInfor = async (req, res) => {
  try {
    // Extract user information from the request user
    const user = req.body;

    // Validate that all inputs are provided
    if (!(user.displayName && user.email && user.password)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }

    if (user.password.length < 8 && user.password.length > 32) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Length of password must be between 8 and 32 characters",
      });
    }

    // Call service
    let data = await changeInforService(user);
    // Return success message
    if (data) {
      return res.status(data.code).json({
        message: data.message,
      });
    }
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Data null",
    });
  } catch (error) {
    // Log error message
    console.error("Error changePassword:", error.message);

    // Return error message
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Error from changePassword.",
      data: null,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  changePassword,
  changeInfor,
};
