import express from "express";
import UserController from "../controllers/userControlller.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const userRoutes = express.Router();
const userController = new UserController();

userRoutes
  .route("/")
  .post(userController.registerUser)
  .get(protect, admin, userController.getUsers);
userRoutes.post("/auth", userController.authUser);
userRoutes.post("/logout", userController.logoutUser);
userRoutes
  .route("/profile")
  .get(protect, userController.getUserProfile)
  .put(protect, userController.updateUserProfile);
userRoutes
  .route("/:id")
  .delete(protect, admin, userController.deleteUser)
  .get(protect, admin, userController.getUserById)
  .put(protect, admin, userController.updateUser);

export default userRoutes;
