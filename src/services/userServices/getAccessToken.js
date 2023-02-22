import { StatusCodes } from "http-status-codes";
import { signInWithCustomToken } from 'firebase/auth'

const getAccessTokenService = async (req, res) => {
  return {
    code: StatusCodes.OK,
    message: "Get access token successfully.",
    data: req.body.accessToken,
  };
};

export default getAccessTokenService;
