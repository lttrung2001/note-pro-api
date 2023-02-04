import userRouter from './userRouter'
import noteRouter from './noteRouter'
const initAPIRouter = (app) => {
  app.use("/api/v1", userRouter());
  app.use('/api/v1/notes', noteRouter())
};

export default initAPIRouter;
