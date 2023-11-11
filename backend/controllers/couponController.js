import asyncHandler from "../middleware/asyncHandler.js";
import Coupon from "../models/couponModel.js";


// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
    const { code, discountPercentage, expirationDate } = req.body;
    
    const couponExists = await Coupon.findOne({ code });

    if (couponExists) {
        res.status(400);
        throw new Error('Coupon with this code already exists');
    }

    const coupon = new Coupon({
        code,
        discountPercentage,
        expirationDate,
    });

    const createdCoupon = await coupon.save();
    res.status(201).json(createdCoupon);
});


// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find({});
    res.json(coupons);
});


// @desc    Get a coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        res.status(404);
        throw new Error('Coupon not found');
    }

    res.json(coupon);
});


// @desc    Update a coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
    const { code, discountPercentage, expirationDate } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        coupon.code = code || coupon.code;
        coupon.discountPercentage = discountPercentage || coupon.discountPercentage;
        coupon.expirationDate = expirationDate || coupon.expirationDate;

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Delete a coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (coupon) {
        await Coupon.findByIdAndRemove(req.params.id);
        res.json({ message: 'Coupon removed' });
    } else {
        res.status(404);
        throw new Error('Coupon not found');
    }
});

// @desc    Validate a coupon
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Coupon code is required');
    }

    const coupon = await Coupon.findOne({ code });
    console.log(coupon);

    if (!coupon) {
        res.status(404);
        throw new Error('Invalid coupon code');
    }

    const currentDate = new Date();

    if (coupon.expirationDate && currentDate > coupon.expirationDate) {
        res.status(400);
        throw new Error('Coupon has expired');
    }

    res.json({ 
        message: 'Coupon is valid',
        discountPercentage: coupon.discountPercentage,
        code: coupon.code
    });
});


export { 
    createCoupon, 
    getCoupons, 
    getCouponById, 
    updateCoupon, 
    deleteCoupon,
    validateCoupon, 
};
