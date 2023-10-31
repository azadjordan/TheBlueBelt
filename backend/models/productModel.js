import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  images: [{
    type: String
}],
  brand: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  manuCost: {
    type: Number,
    required: true,
    default: 0,
  },
  dimensions:{
    type: String,
    required: true,
  },
  source:{
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
}, {
    timestamps: true,
});

const Product = mongoose.model("Product", productSchema)

export default Product
