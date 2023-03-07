import express from "express";
import fileUpload from "express-fileupload";
import initAPIRouter from "./routes/api.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ credentials: true, origin: process.env.URL_FRONTEND }));

app.use(
  fileUpload({
    responseOnLimit: null, // Response when face limit exception
    abortOnLimit: true, // Return 413 when face limit exception
    limitHandler: null, // Handle limit exception
    limits: {
      fileSize: 1024 * 1024 * 2, // File size
      files: 10, // Maxmimum files uploading at the same time
    },
  })
);

initAPIRouter(app);

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is listening on port: ${process.env.PORT || 3000}`);
});
