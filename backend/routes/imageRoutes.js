import express from "express";
import {
  uploadImage,
  getImageById,
  getImages,
  deleteImageById,
  getImageUrls, // Import the new controller function
  getImageNames, // Import the new controller function
} from "../controllers/imageController.js";
import { protect, admin } from '../middleware/authMiddleware.js'
import upload from '../config/s3.js'
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/")
  .get(getImages)
  .post(protect, admin, upload.array('images'), uploadImage);

router.route("/urls").get(getImageUrls); // New route for getting image URLs
router.route("/names").get(getImageNames); // New route for getting image names

router.route("/:id")
  .get(checkObjectId, getImageById)
  .delete(protect, admin, checkObjectId, deleteImageById);

export default router;
