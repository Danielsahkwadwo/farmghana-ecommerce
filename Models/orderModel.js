const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "an order my belong to a user"],
    },
    orders: {
      type: [],
    },
    orderID: {
      type: String,
      required: [true, "an order must have an orderID"],
      unique: true,
    },
    total: {
      type: Number,
      requred: [true, "an order must have a total"],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    received: {
      type: Boolean,
      default: false,
    },
    canceled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("order", orderSchema);
module.exports = Order;
