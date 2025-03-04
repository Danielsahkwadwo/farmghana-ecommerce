const User = require("./../Models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.adminRoleAuth = async (req, res, next) => {
  try {
    if (res.user && res.user.role === "admin") {
      next();
    } else {
      throw new Error("Not authorized as an admin");
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};

exports.verifiedUsersOnly = async (req, res, next) => {
  try {
    if (res.user && res.user.isVerified) {
      next();
    } else {
      throw new Error("Not authorized, please verify your account to continue");
    }
  } catch (error) {
    res.status(401);
    next(error);
  }
};
