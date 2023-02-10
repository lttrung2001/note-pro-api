import userRouter from './userRouter'
import noteRouter from './noteRouter'
import imageRouter from './imageRouter'
import memberRouter from './memberRouter'
const initAPIRouter = (app) => {
  app.use("/api/v1", userRouter());
  app.use('/api/v1/notes', noteRouter())
  app.use('/api/v1/members', memberRouter())
  
};

export default initAPIRouter;
