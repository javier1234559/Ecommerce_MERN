import express from 'express';
import dotenv from 'dotenv';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
dotenv.config();

import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import productRoutes from './routes/productRoutes.js';

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
