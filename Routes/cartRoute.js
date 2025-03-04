const express = require("express");
const { protect } = require("../Middlewares/authMiddleware");
const {
  addToCart,
  getCartDetails,
  deleteCartDetails,
  clearCart,
} = require("../Controllers/cartController");
const router = express.Router();

router.use(protect);
router.post("/add-to-cart", addToCart);
router.get("/get-cart-details", getCartDetails);
router.delete("/delete-cart-detail/:id", deleteCartDetails);
router.delete("/clear-cart", clearCart);

module.exports = router;
