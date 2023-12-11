import express from "express";
import ProductController from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

const productRoutes = express.Router();
const productController = new ProductController();

productRoutes
  .route("/")
  .get(productController.getProducts)
  .post(protect, admin, productController.createProduct);
productRoutes
  .route("/:id/reviews")
  .post(protect, checkObjectId, productController.createProductReview);
productRoutes.get("/top", productController.getTopProducts);
productRoutes
  .route("/:id")
  .get(checkObjectId, productController.getProductById)
  .put(protect, admin, checkObjectId, productController.updateProduct)
  .delete(protect, admin, checkObjectId, productController.deleteProduct);
productRoutes
  .route("/:id/recommend")
  .get(checkObjectId, productController.getListRecommendProduct);

export default productRoutes;
