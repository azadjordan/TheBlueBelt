import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js'; // Adjust this path as needed

dotenv.config({ path: '../.env' });

const connectionString = process.env.MONGO_URI;

if (!connectionString) {
    console.error('MongoDB connection string is undefined. Check your .env file.');
    process.exit(1);
}

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

const updateProductDetails = async () => {
    try {
        const products = await Product.find(); // finds all products

        for (const product of products) {
            const name = product.name.toLowerCase();
            let newPrice = null;

            if (name.includes('special') && name.includes('1-inch') && name.includes('100-yd')) {
                newPrice = 29.99;
            } else if (name.includes('satin') && name.includes('1-inch') && name.includes('100-yd')) {
                newPrice = 27.99;
            } else if (name.includes('satin') && name.includes('0.5-inch') && name.includes('100-yd')) {
                newPrice = 14.99;
            } else if (name.includes('special') && name.includes('1-inch') && name.includes('35-yd')) {
                newPrice = 10.99;
            } else if (name.includes('satin') && name.includes('1-inch') && name.includes('35-yd')) {
                newPrice = 10.99;
            } else if (name.includes('special') && name.includes('0.5-inch') && name.includes('35-yd')) {
                newPrice = 6.99;
            } else if (name.includes('satin') && name.includes('0.5-inch') && name.includes('35-yd')) {
                newPrice = 6.99;
            }

            if (newPrice !== null) {
                product.price = newPrice;
                await product.save();
            }
        }

        console.log('Product details update complete');
    } catch (error) {
        console.log('Error:', error);
    }
};

//updateProductDetails();
