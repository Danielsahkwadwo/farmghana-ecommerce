const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "user",
      required: [true],
    },
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "item",
      required: [true],
    },
    itemName: {
      type: String,
      required: [true, "an item must have a name"],
    },
    quantity: {
      type: Number,
      default: 1,
    },
    subTotal: {
      type: Number,
      required: [true, "an item must have a subtotal"],
    },
    itemImage: {
      type: String,
      required: [true, "an item must have an image"],
    },
    price: {
      type: Number,
      required: [true, "an item must have a price"],
    },
    cartExpiration: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;
