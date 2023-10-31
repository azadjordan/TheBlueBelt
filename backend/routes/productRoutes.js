import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  getTopProducts,
  deleteProductImages
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js'
import upload from '../config/s3.js'
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.get('/top', getTopProducts);
router.route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, upload.array('images'), updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

router.delete('/:id/images', protect, admin, checkObjectId, deleteProductImages);



export default router;
