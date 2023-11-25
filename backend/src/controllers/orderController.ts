import asyncHandler from "../middleware/asyncHandler.js";
import Order, { IOrder, IOrderItem } from "../models/orderModel.js";
import Product from "../models/productModel.js";
import { calcPrices } from "../utils/calcPrices.js";
import { verifyPayPalPayment } from "../utils/paypal.js";
import { Request, Response } from "express";

class OrderController {
  // @desc    Create new order
  // @route   POST /api/orders
  // @access  Private
  addOrderItems = asyncHandler(async (req: Request, res: Response) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    } else {
      // NOTE: here we must assume that the prices from our client are incorrect.
      // We must only trust the price of the item as it exists in
      // our DB. This prevents a user paying whatever they want by hacking our client
      // side code - https://gist.github.com/bushblade/725780e6043eaf59415fbaf6ca7376ff

      // get the ordered items from our database
      const itemsFromDB: IOrderItem[] = await Product.find({
        _id: { $in: orderItems.map((x: any) => x._id) },
      });

      // map over the order items and use the price from our items from database
      const dbOrderItems = orderItems.map((itemFromClient: IOrder) => {
        const matchingItemFromDB = itemsFromDB.find(
          (itemFromDB: any) => itemFromDB._id.toString() === itemFromClient._id
        );
        return {
          ...itemFromClient,
          product: itemFromClient._id,
          price: matchingItemFromDB!.price,
          _id: undefined,
        };
      });

      // calculate prices
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrices(dbOrderItems);

      const order = new Order({
        orderItems: dbOrderItems,
        user: req.user!._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });

      const createdOrder = await order.save();

      res.status(201).json(createdOrder);
    }
  });

  // @desc    Get logged in user orders
  // @route   GET /api/orders/myorders
  // @access  Private
  getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({ user: req.user!._id });
    res.json(orders);
  });

  // @desc    Get order by ID
  // @route   GET /api/orders/:id
  // @access  Private
  getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  });

  // @desc    Update order to paid
  // @route   PUT /api/orders/:id/pay
  // @access  Private
  updateOrderToPaid = asyncHandler(async (req: Request, res: Response) => {
    // ThE VERIFY TOKEN TO CHECK IF THE PAYMENT IS VALID ISN'T WORKING
    // NOTE: here we need to verify the payment was made to PayPal before marking
    // the order as paid
    // const { verified, value } = await verifyPayPalPayment(req.body.id);
    // if (!verified) throw new Error('Payment not verified');

    // // check if this transaction has been used before
    // const isNewTransaction = await checkIfNewTransaction(Order, req.body.id);
    // if (!isNewTransaction) throw new Error('Transaction has been used before');

    const order: IOrder | null = await Order.findById(req.params.id);

    if (order) {
      // check the correct amount was paid
      // const paidCorrectAmount = order.totalPrice.toString() === value;
      // if (!paidCorrectAmount) throw new Error('Incorrect amount paid');

      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  });

  // @desc    Update order to delivered
  // @route   GET /api/orders/:id/deliver
  // @access  Private/Admin
  updateOrderToDelivered = asyncHandler(async (req: Request, res: Response) => {
    const order: IOrder | null = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();

      res.json(updatedOrder);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  });

  // @desc    Get all orders
  // @route   GET /api/orders
  // @access  Private/Admin
  getOrders = asyncHandler(async (req: Request, res: Response) => {
    const orders = await Order.find({}).populate("user", "id name");
    res.json(orders);
  });
}

export default new OrderController();
