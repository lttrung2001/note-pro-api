import registerService from "../services/userServices/register";
import loginService from "../services/userServices/login";
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

    if (data && data.errCode === 200) {
      // Return success message
      return res.status(StatusCodes.OK).json({
        message: data.message,
        data: data.refreshToken,
      });
    } else if (data && data.errCode === 401) {
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

module.exports = {
  registerUser,
  loginUser,
};
