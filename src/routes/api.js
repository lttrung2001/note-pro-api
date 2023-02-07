import userRouter from './userRouter'
import noteRouter from './noteRouter'
import imageRouter from './imageRouter'
const initAPIRouter = (app) => {
  app.use("/api/v1", userRouter());
  app.use('/api/v1/notes', noteRouter())
  
  app.use('/api/v1/images', imageRouter())
};

export default initAPIRouter;
