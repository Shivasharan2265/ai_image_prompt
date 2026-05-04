import express from "express";
import multer from "multer";
import { processImages } from "../controllers/imageController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/process", upload.array("images"), processImages);

export default router;