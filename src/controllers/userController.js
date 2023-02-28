import { StatusCodes } from "http-status-codes";
import userServices from '../services/userServices'

const register = async (req, res) => {
  try {
    // Extract user information from the request body
    const newUser = req.body;

    // Validate that all inputs are provided
    if (!(newUser.email && newUser.password && newUser.fullName && newUser.phoneNumber)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }
    // Call service
    await userServices.register(newUser);
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

const login = async (req, res) => {
  try {
    // Extract user information from the request body
    const user = req.body;

    // Validate that all inputs are provided
    if (!(user.email && user.password)) {
      res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }
    // Call service
    let data = await userServices.login(user);
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

    if (user.newPassword.length < 8 || user.newPassword.length > 32) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Length of newPassword must be between 8 and 32 characters",
      });
    }

    // Call service
    let data = await userServices.changePassword(user);
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
    user.uid = req.user.uid;

    // Validate that all inputs are provided
    if (!(user.fullName && user.phoneNumber)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
        data: null,
      });
    }

    user.phoneNumber = "+84" + user.phoneNumber.split("0")[1];

    // Call service
    let data = await userServices.changeInfor(user);
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

const forgetPassword = async (req, res) => {
  try {
    let email = req.body.email;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "All inputs are required.",
      });
    }
    let data = await userServices.forgetPassword(email);
    if (data && data.code === StatusCodes.OK) {
      console.log("data", data);
      return res.status(data.code).json({
        message: data.message,
      });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "data is null",
      });
    }
  } catch (error) {
    console.log("error reset password", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let { codeVerify, newPassword } = req.body;
    if (!codeVerify && !newPassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "All inputs are required",
      });
    } else if (newPassword.length < 8 || newPassword.length > 32) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Length password must be between 8 and 32 characters",
      });
    }
    let data = await userServices.resetPassword(codeVerify, newPassword);
    return res.status(data.code).json({
      message: data.message,
    });
  } catch (error) {
    console.log("error reset password", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getUserDetails = async (req, res) => {
  try {
    let uid = req.user.uid;
    let data = await detailUserService(uid);
    return res.status(data.code).json({
      message: data.message,
      user: data.user,
    });
  } catch (error) {
    console.log("error detail user", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

const getAccessToken = async (req, res) => {
  try {
    const result = await userServices.getAccessToken(req, res); 
    res.status(StatusCodes.OK).json({
      message: "Get access token successfully.",
      data: result.access_token,
    })
  } catch (error) {
    console.log(`Get access token error: ${error}`)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error,
    });
  }
}

export default {
  register,
  login,
  changePassword,
  changeInfor,
  forgetPassword,
  resetPassword,
  getUserDetails,
  getAccessToken,
};
