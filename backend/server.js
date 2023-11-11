import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/database.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRouter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// 3. Define middleware (authen(), validate() ,...)

// 4  Define router and errorHandler
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/config/paypal', (req, res) =>
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use('/uploads', express.static('/var/data/uploads'));
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  const __dirname = path.resolve();
  app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}
app.use(notFound);
app.use(errorHandler);

// 5. Start server
app.listen(port, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);
