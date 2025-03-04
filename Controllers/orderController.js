const Cart = require("../Models/cartModel");
const Order = require("./../Models/orderModel");
const User = require('./../Models/userModel')
const Address= require('./../Models/addressModel');
const sendEmail = require("../Utils/sendEmail");

exports.addOrder = async (req, res, next) => {
  try {
    const orderId = Date.now();
    const userAddress= await Address.find({userId: res.user.id})
    if(!userAddress) throw new Error('user address not found')
    const myObj= {...userAddress}
    // console.log(myObj[0])
    if(!myObj[0].phone || !myObj[0].address ||!myObj[0].region ||!myObj[0].city){
      throw new Error('Please add address before placing order')
    }
    const newOrder = await Order.create({
      userId: res.user.id,
      orders: req.body.orders,
      total: req.body.total,
      orderID: orderId,
    });
    if (!newOrder) {
      throw new Error("something went wrong");
    }
    newOrder.isActive = true;
    newOrder.received = false;
    newOrder.canceled = false;
    newOrder.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/my-orders`;
    //Send Email
    const subject = "Order Details";
    const send_to = res.user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "orderConfirmation";
    const name = res.user.firstName;
    const link = verificationUrl;
    const myOrderId= newOrder.orderID;
    const total= newOrder.total;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
      myOrderId,
      total
    );

    const cart = await Cart.deleteMany({ userId: res.user.id });
    if (!cart) throw new Error("do details found");

    res.status(200).json({
      status: "success",
      newOrder,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getMyActiveOrders = async (req, res, next) => {
  try {
    const activeOrders = await Order.find({
      userId: res.user.id,
      isActive: true,
    });
    if (!activeOrders) throw new Error("No active orders");

    res.status(200).json({
      ...activeOrders,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getMyReceivedOrders = async (req, res, next) => {
  try {
    const receivedOrders = await Order.find({
      userId: res.user.id,
      received: true,
    });
    if (!receivedOrders) throw new Error("no received orders found");
    res.status(200).json({
      receivedOrders,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) throw new Error("order not found");

    if (!(order.userId.toString() === res.user.id)) {
      throw new Error("Not allowed");
    }
    if (order.canceled) throw new Error("order already canceled");

    order.isActive = false;
    order.received = false;
    order.canceled = true;
    await order.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/orders/active-orders/${id}`;
    //Send Email
    const subject = "Order Cancelled";
    const send_to = res.user.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "orderCancellation";
    const name = res.user.firstName;
    const link = verificationUrl;
    const myOrderId= order.orderID;
    const total= order.total;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
      myOrderId,
      total
    );

    res.status(200).json({
      status: "success",
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: res.user.id, canceled: false })
      .sort("-createdAt")
    if (!orders) {
      throw new Error("No orders found");
    }
    res.status(200).json({ ...orders });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getSingleOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.find({ _id: id });
    if (!order) {
      throw new Error("order with this ID not found");
    }
    res.status(200).json({
      ...order,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};
//adminRoles

exports.setOrderAsActive = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    const orderUser= await User.findOne({_id:order.userId})
if(!orderUser) throw new Error('user not found')
    if (!order) throw new Error("order not found");
    if (order.isActive) {
      throw new Error("order is already active");
    }
    order.received = false;
    order.isActive = true;
    order.canceled = false;
    await order.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/orders/active-orders/${id}`;
    //Send Email
    const subject = "Active Order";
    const send_to = orderUser.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "orderReceived";
    const name = orderUser.firstName;
    const link = verificationUrl;
    const myOrderId= order.orderID;
    const total= order.total;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
      myOrderId,
      total
    );

    const allOrders= await Order.find({canceled:false});
    res.status(200).json({
      ...allOrders,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.setOrderAsReceived = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    const orderUser= await User.findOne({_id:order.userId})
if(!orderUser) throw new Error('user does not exist')
    if (!order) throw new Error("order not found");
    if (order.received) {
      throw new Error("order already received");
    }
    order.received = true;
    order.isActive = false;
    order.canceled = false;
    await order.save();

    const verificationUrl = `${process.env.FRONTEND_URL}/orders/active-orders/${id}`;
    //Send Email
    const subject = "Order Received";
    const send_to = orderUser.email;
    const sent_from = process.env.EMAIL_USER;
    const reply_to = "noreply@gmail.com";
    const template = "orderReceived";
    const name = orderUser.firstName;
    const link = verificationUrl;
    const myOrderId= order.orderID;
    const total= order.total;

    await sendEmail(
      subject,
      send_to,
      sent_from,
      reply_to,
      template,
      name,
      link,
      myOrderId,
      total
    );
    const allOrders= await Order.find({canceled:false});

    res.status(200).json({
      ...allOrders
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllActiveOrders = async (req, res, next) => {
  try {
    const activeOrders = await Order.find({
      isActive: true,
      received: false,
      canceled: false,
    });
    if (!activeOrders) throw new Error("order not found");
    res.status(200).json({
      status: "success",
      activeOrders,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllReceivedOrders = async (req, res, next) => {
  try {
    const receivedOrders = await Order.find({
      received: true,
      canceled: false,
      isActive: false,
    });
    if (!receivedOrders) throw new Error("order not found");
    res.status(200).json({
      status: "success",
      data: {
        receivedOrders,
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllCanceledOrders = async (req, res, next) => {
  try {
    const canceledOrders = await Order.find({
      canceled: true,
      received: false,
      isActive: false,
    });
    if (!canceledOrders) throw new Error("order not found");
    res.status(200).json({
      status: "success",
      data: {
        canceledOrders,
      },
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ canceled: false })
      .sort("-createdAt")
    if (!orders) throw new Error("something went wrong");
    res.status(200).json({ ...orders });
  } catch (error) {
    res.status(404);
    next(error);
  }
};
