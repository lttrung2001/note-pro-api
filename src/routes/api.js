import userRouter from './userRouter'
const initAPIRouter = (app) => {
  app.use("/api/v1", userRouter());
};

export default initAPIRouter;
