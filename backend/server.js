import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/database.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';

// -------------------------------------------
// STEP TO CREATE SERVER API
// 1. Initialize configuration variables, import necessary modules, and connect to the database 
// 2. Base server config (config json(), config cor() ,..)
// 3. Define middleware (authen(), validate() ,...)
// 4  Define router
// 5. Start server
// --------------------------------------------


// 1. Initialize configuration variables, import necessary modules, and connect to the database 
const port = process.env.PORT || 5000;
connectDB();

// 2. Base server config (config json(), config cor() ,..)
const app = express();
app.use(express.json());

// 3. Define middleware (authen(), validate() ,...)

// 4  Define router and errorHandler
app.use('/api/products', productRoutes);
app.use(notFound);
app.use(errorHandler);

// 5. Start server
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
