const express = require("express");
const { protect } = require("../Middlewares/authMiddleware");
const {
  addToWishlist,
  getAllWishlist,
  deleteWishlist,
} = require("../Controllers/wishlistController");

const router = express.Router();

router.post("/add-to-wishlist/:id", protect, addToWishlist);
router.get("/get-all-wishlist", protect, getAllWishlist);
router.delete('/delete-wishlist/:id', protect, deleteWishlist)

module.exports = router;
