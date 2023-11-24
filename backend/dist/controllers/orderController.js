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
exports.getOrders = exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrderById = exports.getMyOrders = exports.addOrderItems = void 0;
const asyncHandler_js_1 = __importDefault(require("../middleware/asyncHandler.js"));
const orderModel_js_1 = __importDefault(require("../models/orderModel.js"));
const productModel_js_1 = __importDefault(require("../models/productModel.js"));
const calcPrices_js_1 = require("../utils/calcPrices.js");
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }
    else {
        // NOTE: here we must assume that the prices from our client are incorrect.
        // We must only trust the price of the item as it exists in
        // our DB. This prevents a user paying whatever they want by hacking our client
        // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff
        // get the ordered items from our database
        const itemsFromDB = yield productModel_js_1.default.find({
            _id: { $in: orderItems.map((x) => x._id) },
        });
        // map over the order items and use the price from our items from database
        const dbOrderItems = orderItems.map((itemFromClient) => {
            const matchingItemFromDB = itemsFromDB.find((itemFromDB) => itemFromDB._id.toString() === itemFromClient._id);
            return Object.assign(Object.assign({}, itemFromClient), { product: itemFromClient._id, price: matchingItemFromDB.price, _id: undefined });
        });
        // calculate prices
        const { itemsPrice, taxPrice, shippingPrice, totalPrice } = (0, calcPrices_js_1.calcPrices)(dbOrderItems);
        const order = new orderModel_js_1.default({
            orderItems: dbOrderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });
        const createdOrder = yield order.save();
        res.status(201).json(createdOrder);
    }
}));
exports.addOrderItems = addOrderItems;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_js_1.default.find({ user: req.user._id });
    res.json(orders);
}));
exports.getMyOrders = getMyOrders;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_js_1.default.findById(req.params.id).populate("user", "name email");
    if (order) {
        res.json(order);
    }
    else {
        res.status(404);
        throw new Error("Order not found");
    }
}));
exports.getOrderById = getOrderById;
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // ThE VERIFY TOKEN TO CHECK IF THE PAYMENT IS VALID ISN'T WORKING
    // NOTE: here we need to verify the payment was made to PayPal before marking
    // the order as paid
    // const { verified, value } = await verifyPayPalPayment(req.body.id);
    // if (!verified) throw new Error('Payment not verified');
    // // check if this transaction has been used before
    // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    // if (!isNewTransaction) throw new Error('Transaction has been used before');
    const order = yield orderModel_js_1.default.findById(req.params.id);
    if (order) {
        // check the correct amount was paid
        // const paidCorrectAmount = order.totalPrice.toString() === value;
        // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error("Order not found");
    }
}));
exports.updateOrderToPaid = updateOrderToPaid;
// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield orderModel_js_1.default.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = yield order.save();
        res.json(updatedOrder);
    }
    else {
        res.status(404);
        throw new Error("Order not found");
    }
}));
exports.updateOrderToDelivered = updateOrderToDelivered;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = (0, asyncHandler_js_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_js_1.default.find({}).populate("user", "id name");
    res.json(orders);
}));
exports.getOrders = getOrders;
