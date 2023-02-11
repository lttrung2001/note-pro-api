import { adminAuth } from "../configs/firestoreConfig";
import { StatusCodes } from "http-status-codes";

export const checkAccessToken = async (req, res, next) => {
  let authorization = req.headers.authorization;
  if (
    !authorization ||
    authorization.split(" ")[0] !== "Bearer" ||
    authorization.split(" ")[1] === ""
  ) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Invalid authorization token",
    });
  }
  let accessToken = authorization.split(" ")[1];
  adminAuth
    .verifyIdToken(accessToken)
    .then((decodedToken) => {
      console.log("decoded", decodedToken);
      req.user.uid = decodedToken.uid;
      return next();
    })
    .catch((error) => {
      console.log("error from access token", error.message);
      return res.status(StatusCodes.FORBIDDEN).json({
        message: error.message,
      });
    });
};
