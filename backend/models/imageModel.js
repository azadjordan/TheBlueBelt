import mongoose from "mongoose";

const imagesSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  tags: [{
    type: String
    // Tags can be used to label and categorize images for easier searching.
    // For example: ['ribbon', 'blue', '1-inch', '100-yd']
  }],
}, {
  timestamps: true
});

const Image = mongoose.model("Image", imagesSchema);

export default Image;
