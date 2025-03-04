const express = require("express");
const {
  registerUser,
  loginUser,
  updateUser,
  getLoginStatus,
  logoutUser,
  verifyUser,
  getUser,
  getUsers,
  forgotPassword,
  changePassword,
  resetPassword,
  deleteUser,
  sendVerificationEmail,
  uploadImage,
  uploadAndResizeUserImage
} = require("../Controllers/userController");
const { protect } = require("../Middlewares/authMiddleware");
const { adminRoleAuth, verifiedUsersOnly } = require("../Controllers/authController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/updateUser", protect,verifiedUsersOnly,uploadImage,uploadAndResizeUserImage, updateUser);
router.get("/loginStatus",  getLoginStatus);
router.get("/logout", logoutUser);
router.get("/verify/:verificationToken", verifyUser);
router.get("/getUser", protect, getUser);
router.delete("/deleteUser/:id", protect, adminRoleAuth,verifiedUsersOnly, deleteUser);
router.get("/getAllUsers", protect, adminRoleAuth, verifiedUsersOnly,getUsers);
router.post("/forgotPassword", forgotPassword);
router.post("/changePassword", protect,verifiedUsersOnly,changePassword);
router.get("/sendVerificationEmail", protect, sendVerificationEmail);
router.post("/resetPassword/:resetToken", resetPassword);

module.exports = router;
