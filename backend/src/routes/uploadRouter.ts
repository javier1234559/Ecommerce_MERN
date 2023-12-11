import express from "express";
import UploadController from "../controllers/uploadController";

const router = express.Router();
const uploadController = new UploadController();

router.post("/", uploadController.uploadImage);

export default router;
