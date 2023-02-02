import express from "express";
import userController from "../controller/userController";

let router = express.Router();

const initAPIRouter = (app) => {
  router.post("/register", userController.registerUser);
  return app.use("/api/v1", router);
};

export default initAPIRouter;
