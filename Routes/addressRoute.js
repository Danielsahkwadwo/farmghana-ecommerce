const express = require("express");
const {
  updateAddress,
  getMyAddress,
  getUserAddress,
} = require("../Controllers/addressController");
const { protect } = require("../Middlewares/authMiddleware");
const { adminRoleAuth } = require("../Controllers/authController");
const router = express.Router();

router.patch("/update-address/:id", protect, updateAddress);
router.get("/get-address", protect, getMyAddress);
router.get("/get-user-address/:id", protect, adminRoleAuth, getUserAddress);
module.exports = router;
