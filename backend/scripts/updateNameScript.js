import mongoose from 'mongoose';
import dotenv from 'dotenv';
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

// Function to replace 'white' with 'White'
const capitalizeWhite = str => str.replace(/\bwhite\b/gi, 'White');

const updateProductNames = async () => {
    try {
        console.log('Updating product names...');

        const products = await Product.find({ name: /white/i });

        for (const product of products) {
            const updatedName = capitalizeWhite(product.name);
            if (updatedName !== product.name) {
                product.name = updatedName;
                await product.save();
                console.log(`Updated product name to: ${updatedName}`);
            }
        }

        console.log('Product name update complete.');
    } catch (error) {
        console.log('Error:', error);
    }
};

updateProductNames();