const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "item",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Wishlist = mongoose.model("wishlist", WishlistSchema);
module.exports = Wishlist;
