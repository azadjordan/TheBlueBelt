import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';
import { calcPrices } from '../utils/calcPrices.js';
import sendEmail from "../utils/sendEmails.js";
import Coupon from '../models/couponModel.js'


// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {

  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

  let discountPercentage = 0;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      res.status(400);
      throw new Error('Invalid coupon code');
    }

    if (new Date(coupon.expirationDate) < new Date()) {
      res.status(400);
      throw new Error('Coupon has expired');
    }

    discountPercentage = coupon.discountPercentage;
  }


  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
  } else {
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x) => x._id) },
    });


    const dbOrderItems = orderItems.map((itemFromClient) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) => itemFromDB._id.toString() === itemFromClient._id
      );
      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
        _id: undefined,
      };
    });

    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(dbOrderItems, discountPercentage);

    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    const orderedItemsHTML = createdOrder.orderItems.map(item => `
      <tr>
        <td>${item.name}</td>
        <td>${item.qty}</td>
        <td>${item.dimensions}</td>
      </tr>
    `).join('');

    const currentDate = new Date().toLocaleString();

    await sendEmail({
      to: ['azadkkurdi@gmail.com', 'almomani95hu@gmail.com'],
      subject: 'New Order Received',
      html: `
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px;">
          <h3 style="text-align: center; color: darkblue;"> New Order </h3>
          <p><strong>Date:</strong> ${currentDate}</p>
          <p><strong>Client:</strong> <span style="color: blue;">${req.user?.name}</span></p>
          <p><strong>Email:</strong> ${req.user?.email}</p>
          <p><strong>Phone:</strong> ${req.user?.phoneNumber}</p>
          <p><strong>Order ID:</strong> ${createdOrder._id}</p>
          <p><strong>Delivery:</strong> <span style="color: red;">${createdOrder.shippingAddress.city}</span> </p>
          <p><strong>Payment:</strong> AED ${createdOrder.totalPrice} (VAT included)</p>
          <p><strong>Products:</strong></p>
          <table border="1" cellspacing="0" cellpadding="10" style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Dimensions</th>
              </tr>
            </thead>
            <tbody>
              ${orderedItemsHTML}
            </tbody>
          </table>
        </div>
      `
    });

    res.status(201).json(createdOrder);
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.status(200).json(orders)
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email')

  if (order) {
    res.status(200).json(order)

  } else {
    res.status(404)
    throw new Error('Order not found')
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {

  const order = await Order.findById(req.params.id);

  if (order) {
    if (order.isPaid) {
      res.status(400);
      throw new Error('Order already marked as paid');
    }

    order.isPaid = true;
    order.paidAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)

  if (order) {
    if (order.isDelivered) {
      res.status(400);
      throw new Error('Order already marked as delivered');
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});


// @desc    Get all orders (Recent first)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({})
    .sort({ createdAt: -1 })  // Sort by createdAt in descending order
    .populate('user', 'id name');
  res.status(200).json(orders);
});


export {
  getMyOrders,
  getOrders,
  getOrderById,
  updateOrderToDelivered,
  updateOrderToPaid,
  addOrderItems,
};
