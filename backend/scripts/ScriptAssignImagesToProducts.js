import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Image from '../models/imageModel.js'; 
import Product from '../models/productModel.js'; 

dotenv.config({ path: '../../.env' });

const connectionString = process.env.MONGO_URI;

if (!connectionString) {
    console.error('MongoDB connection string is undefined. Check your .env file.');
    process.exit(1);
}

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));


// ...

const updateProductImages = async () => {
    try {
        console.log('Updating products with images...');

        const images = await Image.find();
        console.log(`Found ${images.length} images`);

        const products = await Product.find();
        console.log(`Found ${products.length} products`);

        let updateCount = 0;
        for (const image of images) {
            // Create a modified image name by inserting spaces before capital letters and converting to lowercase
            const modifiedImageName = image.name.replace(/([A-Z])/g, ' $1').trim().toLowerCase();

            for (const product of products) {
                const productNameLower = product.name.toLowerCase();

                // Check if the product name starts with the modified image name
                if (productNameLower.startsWith(modifiedImageName)) {
                    console.log(`Matching image found for product: ${product.name}, Image: ${image.name}`);
                    product.images.push(image.imageUrl);
                    await product.save();
                    updateCount++;
                }
            }
        }

        console.log(`Product images update complete. Total updates: ${updateCount}`);
    } catch (error) {
        console.log('Error:', error);
    }
};

updateProductImages();
