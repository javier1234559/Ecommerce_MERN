"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopProducts = exports.createProductReview = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const asyncHandler_js_1 = __importDefault(require("../middleware/asyncHandler.js"));
const productModel_js_1 = __importDefault(require("../models/productModel.js"));
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Determine the number of products per page (e.g., 20 products).
    // 2. Get the page number; the default is 1.
    // 3. Search for products using a keyword. 
    //    The keyword can be in regular expression format, and the "i" option makes it case-insensitive.
    // 4. Count the total number of products.
    // 5. Retrieve products based on the provided keyword with a result limit and skip (pageSize * numberOfPage)
    const pageSize = process.env.PAGINATION_LIMIT || 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};
    const count = yield productModel_js_1.default.countDocuments(Object.assign({}, keyword));
    const products = yield productModel_js_1.default.find(Object.assign({}, keyword))
        .limit(pageSize)
        .skip(pageSize * (page - 1));
    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize)
    });
}));
exports.getProducts = getProducts;
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check valid objectID , this case it will handle in checkObjectId middleware
    // 2. Find product by id 
    const product = yield productModel_js_1.default.findById(req.params.id);
    if (product) {
        return res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
exports.getProductById = getProductById;
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user must be authenticated at protect middleware
    // 2. Check user is admin at admin middleware
    // 3. Get data from req.body and create new Product object
    // 4. Save new product
    const { name, user, price, description, image, brand, category, countInStock } = req.body;
    console.log(req.body);
    const product = new productModel_js_1.default({
        name: name,
        price: price,
        user: user._id,
        image: image,
        brand: brand,
        category: category,
        countInStock: countInStock,
        numReviews: 0,
        description: description,
    });
    const createdProduct = yield product.save();
    res.status(201).json(createdProduct);
}));
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user must be authenticated at protect middleware
    // 2. Check user is admin at admin middleware
    // 3. get data from req.body
    // 4. find product by id 
    // 5. if exist update else throw new Error("Product not Found")
    const { name, price, description, image, brand, category, countInStock } = req.body;
    const product = yield productModel_js_1.default.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;
        const updatedProduct = yield product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
exports.updateProduct = updateProduct;
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user must be authenticated at protect middleware
    // 2. Check user is admin at admin middleware
    const product = yield productModel_js_1.default.findById(req.params.id);
    if (product) {
        yield productModel_js_1.default.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
exports.deleteProduct = deleteProduct;
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Check user must be authenticated at protect middleware
    // 2. Get rating , comment ,user , id from request
    // 3. Find product by 
    const { rating, comment } = req.body;
    const product = yield productModel_js_1.default.findById(req.params.id);
    if (product) {
        const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
                product.reviews.length;
        yield product.save();
        res.status(201).json({ message: 'Review added' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
}));
exports.createProductReview = createProductReview;
// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //Find top 3 product and sort with rating descending order
    const products = yield productModel_js_1.default.find({})
        .sort({ rating: -1 })
        .limit(3);
    res.json(products);
}));
exports.getTopProducts = getTopProducts;
