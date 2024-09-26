import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controller/MessagesController.js";
import multer from "multer";

const messagesRouter = Router();
const upload = multer({ dest: "uploads/files" });

messagesRouter.post("/get-messages", verifyToken, getMessages);
messagesRouter.post(
  "/upload-file",
  verifyToken,
  upload.single("file"),
  uploadFile
);

export default messagesRouter;
