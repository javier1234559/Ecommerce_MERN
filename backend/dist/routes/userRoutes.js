"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userControlller_js_1 = require("../controllers/userControlller.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.route('/').post(userControlller_js_1.registerUser).get(authMiddleware_js_1.protect, authMiddleware_js_1.admin, userControlller_js_1.getUsers);
router.post('/auth', userControlller_js_1.authUser);
router.post('/logout', userControlller_js_1.logoutUser);
router
    .route('/profile')
    .get(authMiddleware_js_1.protect, userControlller_js_1.getUserProfile)
    .put(authMiddleware_js_1.protect, userControlller_js_1.updateUserProfile);
router
    .route('/:id')
    .delete(authMiddleware_js_1.protect, authMiddleware_js_1.admin, userControlller_js_1.deleteUser)
    .get(authMiddleware_js_1.protect, authMiddleware_js_1.admin, userControlller_js_1.getUserById)
    .put(authMiddleware_js_1.protect, authMiddleware_js_1.admin, userControlller_js_1.updateUser);
exports.default = router;
