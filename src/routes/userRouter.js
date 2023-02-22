import { Router } from "express";
import userController from "../controllers/userController";
import middlewares from '../middlewares'

  const router = Router();
  router.post("/register", userController.register);
  router.post("/login", userController.login);
  router.post(
    "/change-password",
    middlewares.verifyAccessToken,
    userController.changePassword
  );
  router.post("/change-infor", middlewares.verifyAccessToken, userController.changeInfor);
  router.get("/get-user-details", middlewares.verifyAccessToken, userController.getUserDetails);
  router.post("/forget-password", userController.forgetPassword);
  router.post("/reset-password", userController.resetPassword);
  router.get("/get-access-token", userController.getAccessToken);

export default router