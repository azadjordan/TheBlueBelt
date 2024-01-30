import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  getTopProducts,
  removeProductImages,
  getProductsByStock  // Import the new controller
} from "../controllers/productController.js";
import { protect, admin } from '../middleware/authMiddleware.js';
import checkObjectId from "../middleware/checkObjectId.js";

const router = express.Router();

router.route("/").get(getProducts).post(protect, admin, createProduct);
router.route("/lowstock").get(getProductsByStock);  // Add the new route for low stock products
router.get('/top', getTopProducts);
router.route("/:id")
  .get(checkObjectId, getProductById)
  .put(protect, admin, checkObjectId, updateProduct)
  .delete(protect, admin, checkObjectId, deleteProduct);

router.put('/:id/images', protect, admin, checkObjectId, removeProductImages);

export default router;
