import registerService from "../services/userServices/register";

let registerUser = async (req, res) => {
  try {
    let data = await registerService(req, res);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server: " + error.message,
    });
  }
};

module.exports = {
  registerUser,
};
