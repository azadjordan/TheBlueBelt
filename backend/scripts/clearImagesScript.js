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

const clearProductImages = async () => {
    try {
        console.log('Clearing images from all products...');

        await Product.updateMany({}, { $set: { images: [] } });

        console.log('All product images have been cleared');
    } catch (error) {
        console.log('Error:', error);
    }
};

clearProductImages();