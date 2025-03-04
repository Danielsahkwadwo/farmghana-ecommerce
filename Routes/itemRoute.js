const express = require("express");
const {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
  getSingleItem,
  uploadItemImage,
  uploadAndResizeProductImage,
  getSimilarProducts,
  searchItem,
} = require("../Controllers/itemController");
const { protect } = require("../Middlewares/authMiddleware");
const {
  adminRoleAuth,
  verifiedUsersOnly,
} = require("../Controllers/authController");
const router = express.Router();

router.get("/allItems", getAllItems);
router.get("/similar-products", getSimilarProducts);

router.post(
  "/createItem",
  protect,
  adminRoleAuth,
  verifiedUsersOnly,
  uploadItemImage,
  uploadAndResizeProductImage,
  createItem
);
router.patch(
  "/updateItem/:id",
  protect,
  adminRoleAuth,
  verifiedUsersOnly,
  uploadItemImage,
  uploadAndResizeProductImage,
  updateItem
);
router.delete(
  "/deleteItem/:id",
  protect,
  adminRoleAuth,
  verifiedUsersOnly,
  deleteItem
);
router.get("/getItem/:id", getSingleItem);
router.get("/search/:key", searchItem);

module.exports = router;
