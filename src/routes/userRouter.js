import { Router } from "express";
import { checkAccessToken } from "../middleware/JWT";
import userController from "../controllers/userController";

const userRouter = () => {
  const router = Router();
  router.post("/register", userController.registerUser);
  router.post("/login", userController.loginUser);
  router.post(
    "/change-password",
    checkAccessToken,
    userController.changePassword
  );
  router.post("/change-infor", checkAccessToken, userController.changeInfor);
  router.get("/detail-user", checkAccessToken, userController.detailUser);
  router.post("/forget-password", userController.forgetPassword);
  router.post("/reset-password", userController.resetPassword);

  return router;
};

module.exports = userRouter;
