import path from 'path'
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from './routes/couponRoutes.js';


import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// log every request
app.use((req, res, next) => {
  console.log(`PATH: [${req.path}]      METHOD: [${req.method}]`);
  next();
});

// cookie parser middleware
app.use(cookieParser());

app.use("/api/products", productRoutes)
app.use("/api/users", userRoutes)
app.use("/api/orders", orderRoutes)
app.use('/api/coupons', couponRoutes);

const __dirname = path.resolve()
app.use('/uploads', express.static(path. join(__dirname, '/uploads')))

if (process.env.NODE_ENV === 'production') {
// set static folder
app.use(express.static(path.join(__dirname, '/frontend/build')));
// any route that is not api will be redirected to index.html
app.get('*', (req, res) =>
res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
)
} else {
  app.get("/", (req, res) => {
    res.send("API is running");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
