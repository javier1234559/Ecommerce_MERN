"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const productController_js_1 = require("../controllers/productController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const checkObjectId_js_1 = __importDefault(require("../middleware/checkObjectId.js"));
router
    .route('/')
    .get(productController_js_1.getProducts)
    .post(authMiddleware_js_1.protect, authMiddleware_js_1.admin, productController_js_1.createProduct);
router
    .route('/:id/reviews')
    .post(authMiddleware_js_1.protect, checkObjectId_js_1.default, productController_js_1.createProductReview);
router
    .get('/top', productController_js_1.getTopProducts);
router
    .route('/:id')
    .get(checkObjectId_js_1.default, productController_js_1.getProductById)
    .put(authMiddleware_js_1.protect, authMiddleware_js_1.admin, checkObjectId_js_1.default, productController_js_1.updateProduct)
    .delete(authMiddleware_js_1.protect, authMiddleware_js_1.admin, checkObjectId_js_1.default, productController_js_1.deleteProduct);
exports.default = router;
