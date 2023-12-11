import express from "express";
import OrderController from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();
const orderController = new OrderController();

orderRoutes
  .route("/")
  .post(protect, orderController.addOrderItems)
  .get(protect, admin, orderController.getOrders);
orderRoutes.route("/mine").get(protect, orderController.getMyOrders);
orderRoutes.route("/:id").get(protect, orderController.getOrderById);
orderRoutes.route("/:id/pay").put(protect, orderController.updateOrderToPaid);
orderRoutes
  .route("/:id/deliver")
  .put(protect, admin, orderController.updateOrderToDelivered);

export default orderRoutes;
