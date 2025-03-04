const Wishlist = require("../Models/wishlistModel");

exports.addToWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingItem = await Wishlist.findOne({
      userId: res.user.id,
      productId: id,
    });
    if (existingItem) throw new Error("Item already added to whishlist");

    const item = await Wishlist.create({
      userId: res.user.id,
      productId: id,
    });
    if (!item) throw new Error("An error occured");
    res.status(200).json({
      item,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getAllWishlist = async (req, res, next) => {
  try {
    const allWishlist = await Wishlist.find({userId:res.user.id})
      .populate("productId")
      .sort("-createdAt");
    if (!allWishlist) throw new Error("An error occured");
    res.status(200).json({
      allWishlist,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.deleteWishlist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Wishlist.find({ userId: res.user.id, productId: id });
    if (!item) {
      throw new Error("Not allowed");
    }
    const deletedItem =await Wishlist.findByIdAndDelete(id);
    res.status(200).json({
      deletedItem
    });
  } catch (err) {
    res.status(400);
    next(err);
  }
};
