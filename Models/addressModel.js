const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    firstName: {
      type: String,
      // required: [true, "a user must have a firstname"],
    },
    lastName: {
      type: String,
      // required: [true, "a user must have a lastname"],
    },
    phone: {
      type: Number,
      // required: [true, "a customer must have a phone number"],
    },
    additionalPhone: {
      type: Number,
    },
    address: {
      type: String,
      // required: [true, "a customer must have an address"],
    },
    additionalInformation: {
      type: String,
    },
    region: {
      type: String,
      // required: [true, "please enter a region"],
    },
    city: {
      type: String,
      // required: [true, "please enter a city"],
    },
  },
  { timestamps: true }
);

const Address = mongoose.model("address", addressSchema);
module.exports = Address;
