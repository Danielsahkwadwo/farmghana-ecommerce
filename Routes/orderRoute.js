const express = require("express");
const { protect } = require("../Middlewares/authMiddleware");
const {
  addOrder,
  getMyActiveOrders,
  getMyReceivedOrders,
  cancelOrder,
  getAllActiveOrders,
  getAllReceivedOrders,
  getAllCanceledOrders,
  setOrderAsActive,
  setOrderAsReceived,
  getMyOrders,
  getSingleOrder,
  getAllOrders,
} = require("../Controllers/orderController");
const { verifiedUsersOnly, adminRoleAuth } = require("../Controllers/authController");
const router = express.Router();

router.post("/add-order", protect,  addOrder);
router.get('/get-all-orders', protect, getMyOrders);
router.get("/get-active-orders", protect, getMyActiveOrders);
router.get("/get-received-orders", protect, getMyReceivedOrders);
router.patch('/cancel-order/:id', protect, cancelOrder)
router.get('/get-single-order/:id', protect,getSingleOrder)

router.get('/get-all-active-orders', protect, adminRoleAuth,getAllActiveOrders)
router.get('/get-all-received-orders', protect,adminRoleAuth, getAllReceivedOrders)
router.get('/get-all-canceled-orders', protect, adminRoleAuth, getAllCanceledOrders)
router.patch('/set-order-as-active/:id', protect,adminRoleAuth, setOrderAsActive)
router.get('/get-admin-orders', protect, adminRoleAuth, getAllOrders)
router.patch('/set-order-as-received/:id', protect, adminRoleAuth, setOrderAsReceived)
module.exports = router;
