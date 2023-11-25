import express from "express";
const router = express.Router();
import OrderController from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/").post(protect, OrderController.addOrderItems).get(protect, admin, OrderController.getOrders);
router.route("/mine").get(protect, OrderController.getMyOrders);
router.route("/:id").get(protect, OrderController.getOrderById);
router.route("/:id/pay").put(protect, OrderController.updateOrderToPaid);
router.route("/:id/deliver").put(protect, admin, OrderController.updateOrderToDelivered);

export default router;
