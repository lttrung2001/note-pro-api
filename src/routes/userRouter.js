import { Router } from "express";
import { checkAccessToken } from "../middleware/JWT";
import userController from "../controllers/userController";

const userRouter = () => {
  const router = Router();
  router.post("/register", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.post(
    "/changePassword",
    checkAccessToken,
    userController.changePassword
  );
  router.post("/changeInfor", checkAccessToken, userController.changeInfor);
  router.post("/forgetPassword", userController.forgetPassword);

  return router;
};

module.exports = userRouter;
