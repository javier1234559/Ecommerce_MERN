import express from "express";
const router = express.Router();
import ProductController from "../controllers/productController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import checkObjectId from "../middleware/checkObjectId.js";

router
  .route("/")
  .get(ProductController.getProducts)
  .post(protect, admin, ProductController.createProduct);
router
  .route("/:id/reviews")
  .post(protect, checkObjectId, ProductController.createProductReview);
router.get("/top", ProductController.getTopProducts);
router
  .route("/:id")
  .get(checkObjectId, ProductController.getProductById)
  .put(protect, admin, checkObjectId, ProductController.updateProduct)
  .delete(protect, admin, checkObjectId, ProductController.deleteProduct);

export default router;
