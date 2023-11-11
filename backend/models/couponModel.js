import mongoose from 'mongoose';

const couponSchema = mongoose.Schema({
   code: { type: String, required: true, unique: true },
   discountPercentage: { type: Number, required: true },
   expirationDate: { type: Date, required: true },
});

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
