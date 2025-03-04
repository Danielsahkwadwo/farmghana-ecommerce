const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    addressId: {
      type: mongoose.SchemaTypes.ObjectId,
    },
    firstName: {
      type: String,
      required: [true, "This field is required"],
      minLength: [3, "first nname  cannot be less than 3 characters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "This field is required"],
      minLength: [3, "last name  cannot be less than 3 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "A user must have a password"],
      minLength: [6, "user password must not be less than 6 characters"],
      select: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "suspended"],
    },
    userPhoto: {
      type: String,
      default: "https://res.cloudinary.com/dlvaxaov8/image/upload/v1689164503/sample.jpg",
    },
    phone: {
      type: Number,
    },
    address: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetToken: {
      type: String,
    },
    verificationToken: {
      type: String,
    },
    tokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;

  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
