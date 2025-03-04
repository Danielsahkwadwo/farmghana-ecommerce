const Cart = require("./../Models/cartModel");

exports.addToCart = async (req, res, next) => {
  try {
    const { itemName,  price,subTotal, itemImage, id } = req.body;
    const cartBody = { itemName, price,subTotal, itemImage };
    const existingCart = await Cart.findOne({
      userId: res.user.id,
      productId: id,
    });
    if (existingCart) {
      throw new Error("Item already added to cart");
    }
    const cart = await Cart.create({
      userId: res.user.id,
      productId: id,
      ...cartBody,
    });

    if (!cart) {
      throw new Error("something went wrong");
    }
    cart.cartExpiration = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000); //30 days
    await cart.save();

    res.status(200).json({
      status: "success",
      cart,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getCartDetails = async (req, res, next) => {
  try {
    const cartDetails = await Cart.find({ userId: res.user.id }).sort('-createdAt');
    if (!cartDetails) throw new Error("no details in cart");
    res.status(200).json({
      cartDetails,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.deleteCartDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const activeCart = await Cart.findById(id);
    if (!activeCart) throw new Error("item not found");

    if (res.user.id !== activeCart.userId.toString()) {
      throw new Error("Item was not added by this user");
    }
    await Cart.findByIdAndDelete(id);

    res.status(200).json({
      data: null,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.updateCartDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const cart = await Cart.findByIdAndUpdate(
      id,
      { ...req.body },
      {
        save: true,
        runValidators: true,
      }
    );
    if (!cart) {
      throw new Error("cart with this id not found");
    }
    res.status(400).json({
      status: "success",
      cart,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.deleteMany({ userId: res.user.id });
    if (!cart) throw new Error("do details found");
    res.status(200).send(null);
  } catch (error) {
    res.status(400);
    next(error);
  }
};
