import asyncHandler from "../middleware/asyncHandler.js"
import Product from "../models/productModel.js"
import { deleteImage } from "../config/s3.js";


// @desc    Delete all images of a product from S3
// @route   DELETE /api/products/:id/images
// @access  Private/Admin
const deleteProductImages = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (product) {
      for (const imageUrl of product.images) {
          const rawKey = imageUrl.split('.com/')[1];
          const Key = decodeURIComponent(rawKey); // Decode the extracted key
          if (Key) await deleteImage(Key);
      }

      // Clear the images array in the product document
      product.images = [];
      await product.save();

      res.status(200).json({ message: 'Images deleted successfully' });
  } else {
      res.status(404);
      throw new Error('Product not found');
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, brand, category, countInStock, manuCost, dimensions, source } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    let imageUrls = product.images || []; // Initialize with existing images, if any.

    if (req.files && req.files.length > 0) {
      // If the sample image is present in the array at the first index, remove it
      if (imageUrls[0] === '/images/sample.jpg') {
        imageUrls.shift();
      }

      // Since multer middleware has already processed the files, 
      // you can directly access the location URLs
      for (let i = 0; i < req.files.length; i++) {
        imageUrls.push(req.files[i].location);
      }

      product.images = imageUrls; // Simply set the accumulated image URLs.
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.manuCost = manuCost || product.manuCost;
    product.dimensions = dimensions || product.dimensions;
    product.source = source || product.source;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

// @desc    Delete a product and its images from S3
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {

  const product = await Product.findById(req.params.id);

  if (product) {
      for (const imageUrl of product.images) {
          const rawKey = imageUrl.split('.com/')[1];
          const Key = decodeURIComponent(rawKey); // Decode the extracted key
          if (Key) await deleteImage(Key);
      }

      await Product.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Product deleted successfully' });
  } else {
      res.status(404);
      throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    images: ['/images/sample.jpg'],
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    manuCost: 0,
    dimensions: 'number-unit number-unit',
    source: 'sample source',
    description: 'Sample description',
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Fetch all products
// @route   Get /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1


  let keywordQuery = {};
  if (req.query.keyword) {
    const keywords = req.query.keyword.split(',').map(keyword => {
      return { name: { $regex: keyword, $options: 'i' } };
    });
    keywordQuery = { $and: keywords };
  }

  const count = await Product.countDocuments({ ...keywordQuery });
  const products = await Product.find({ ...keywordQuery })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch a product
// @route   Get /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
})

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
// @access  Private
// const createProductReview = asyncHandler(async (req, res) => {
//   const { rating, comment } = req.body

//   const product = await Product.findById(req.params.id);

//   if (product) {
//     const alreadyReviewed = product.reviews.find(
//       (review) => review.user.toString() === req.user._id.toString()
//     )

//     if (alreadyReviewed) {
//       res.status(400)
//       throw new Error('Product already reviewed')
//     }

//     const review = {
//       name: req.user.name,
//       rating: Number(rating),
//       comment,
//       user: req.user._id,
//     }

//     product.reviews.push(review)

//     product.numReviews = product.reviews.length

//     product.rating =
//       product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length

//     await product.save()
//     res.status(201).json({ message: 'Review added' })
//   } else {
//     res.status(404);
//     throw new Error('Resource not found');
//   }
// })

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3) // getting top 3 rated products
  res.status(200).json(products)
})





export { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getTopProducts, deleteProductImages }