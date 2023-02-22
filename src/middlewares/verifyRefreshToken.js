import request from "request";
import { StatusCodes } from 'http-status-codes'
import firebaseConfig from '../configs/firebaseConfig'
const verifyRefreshToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  const token = authorization.split(" ")[1];
  if (!token) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Token required.",
      data: null,
    });
  }
  request.post(
    "https://securetoken.googleapis.com/v1/token?key=AIzaSyDKwh8lcC5jFJcFDtImtzVx0Bk7DQGL0yc",
    {
      json: true,
      body: {
        grant_type: "refresh_token",
        refresh_token: token,
      },
    },
    (error, response, body) => {
      if (error) {
        console.log(`Verify refresh token error: ${error}`);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          message: error.message,
          data: null,
        });
      } else if (response.statusCode == StatusCodes.OK) {
        req.body = {
          accessToken: body.id_token,
        };
        next();
      } else {
        console.log(`Verify refresh token error: ${body.error}`);
        res.status(body.error.code).json({
          message: body.error.message,
        });
      }
    }
  );
};

export default verifyRefreshToken;
