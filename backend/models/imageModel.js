import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: false // Not required because it's auto-generated
  },
  tags: [{
    type: String
  }],
}, {
  timestamps: true
});

const Image = mongoose.model("Image", imagesSchema);

export default Image;
