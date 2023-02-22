import { StatusCodes } from "http-status-codes";
import { signInWithCustomToken } from "firebase/auth";

const getAccessTokenService = async (req, res) => {
  const token = req.body;
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
        return {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
        };
      } else if (response.statusCode == StatusCodes.OK) {
        return {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: error.message,
          data: body.id_token,
        };
      } else {
        console.log(`Verify refresh token error: ${body.error}`);
        res.status(body.error.code).json({
          message: body.error.message,
        });
      }
    }
  );
};

export default getAccessTokenService;
