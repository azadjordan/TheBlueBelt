import express from 'express';
const router = express.Router();
import {
    createCoupon,
    getCoupons,
    getCouponById,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
} from '../controllers/couponController.js';
import { protect, admin } from '../middleware/authMiddleware.js';


// Route for validating a coupon code
router.route('/validate')
    .post(validateCoupon);

// Route for creating a new coupon and getting all coupons
router.route('/')
    .post(protect, admin, createCoupon)
    .get(protect, admin, getCoupons);


// Routes for getting a coupon by ID, updating a coupon, and deleting a coupon
router.route('/:id')
    .get(protect, admin, getCouponById)
    .put(protect, admin, updateCoupon)
    .delete(protect, admin, deleteCoupon);

export default router;
