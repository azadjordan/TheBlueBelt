import asyncHandler from "../middleware/asyncHandler.js"
import Image from '../models/imageModel.js'; // Import your Image model
import { deleteImage as deleteImageFromS3 } from '../config/s3.js'; // Import the S3 deletion function

// @desc    Upload one or more images
// @route   POST /api/images
// @access  Private/Admin
export const uploadImage = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('No images provided for upload');
    }

    // Extract tags from req.body and ensure it's always an array
    const tags = Array.isArray(req.body.tags) ? req.body.tags : req.body.tags ? [req.body.tags] : [];

    const uploadedImages = req.files.map(file => ({
        imageUrl: file.location, // 'location' should contain the URL of the uploaded image
        tags: tags // Add tags to each image
    }));

    const savedImages = await Image.insertMany(uploadedImages);

    res.status(201).json(savedImages);
});


// @desc    Get all images
// @route   GET /api/images
// @access  Public or Private/Admin
export const getImages = asyncHandler(async (req, res) => {
    const images = await Image.find({}); // Fetch all images from the database
    res.json(images); // Send the array of images back to the client
});

// @desc    Get an image by ID
// @route   GET /api/images/:id
// @access  Public or Private/Admin
export const getImageById = asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id);

    if (!image) {
        res.status(404);
        throw new Error('Image not found');
    }

    res.json(image); // Send the image document back to the client
});

// @desc    Delete an image by ID
// @route   DELETE /api/images/:id
// @access  Private/Admin
export const deleteImageById = asyncHandler(async (req, res) => {
    const image = await Image.findById(req.params.id);

    if (!image) {
        res.status(404);
        throw new Error('Image not found');
    }

    // Extract the key for the S3 object from the image URL
    const rawKey = image.imageUrl.split('.com/')[1];
    const key = decodeURIComponent(rawKey);

    try {
        // First, try to delete the image from S3
        await deleteImageFromS3(key);

        // If successful, then delete the document from MongoDB
        await Image.deleteOne({ _id: image._id });

        res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
        // Handle possible errors during the deletion process
        res.status(500);
        throw new Error('Error deleting image: ' + error.message);
    }
});
