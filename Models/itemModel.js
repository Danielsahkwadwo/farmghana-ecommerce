const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
      required: [true, "item must have a user"],
    },
    itemName: {
      type: String,
      required: [true, "An item must have a name"],
    },
    category: {
      type: String,
      required: [true, "An item must belong to a category"],
    },
    itemImage: {
      type: String,
      required: [true, "an item must have an image"],
    },
    quantity: {
      type: Number,
      required: [true, "an item must have a quantity"],
    },
    itemBrand: {
      type: String,
      required: [true, "An item must have a brand"],
    },
    price: {
      type: Number,
      required: [true, "an item must have a price"],
    },
    weight: {
      type: Number,
      required: [true, "an item requires a weight"],
    },
    images: {
      type: [String],
      required: [true, "an item requires images"],
    },
    description: {
      type: String,
      required: [true, "an item must have a description"],
    },
    isSoldOut: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model("item", itemSchema);

module.exports = Item;
