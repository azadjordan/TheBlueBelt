// routes/uploadRoutes.js
import express from "express";
import upload from "../config/s3.js";
import { protect, admin } from '../middleware/authMiddleware.js'


const router = express.Router();

router.post("/", protect, admin, upload.array("images"), (req, res) => {
    // After the images are uploaded to S3, their URLs will be returned
    const imageUrls = req.files.map(file => file.location);
    res.send(imageUrls);
});

export default router;
