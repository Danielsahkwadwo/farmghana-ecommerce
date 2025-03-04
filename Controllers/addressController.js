const User = require("../Models/userModel");
const Address = require("./../Models/addressModel");

exports.updateAddress = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { firstName, lastName, phone, address, region, city } = req.body;
    if (!firstName || !lastName || !phone || !address || !region || !city) {
      throw new Error("please enter all required fields");
    }
    const myAddress = await Address.findOne({ userId: res.user.id });
    const user = await User.findById(res.user.id);
    if (!myAddress) throw new Error("an error occured");

    const userAddress = await Address.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!userAddress) throw new Error("no address found");
    user.addressId = userAddress._id;
    user.phone = userAddress.phone;
    user.address = userAddress.address;
    await user.save();

    res.status(200).json({
      userAddress,
    });
  } catch (error) {
    res.status(404);
    next(error);
  }
};

exports.getMyAddress = async (req, res, next) => {
  try {
    const myAddress = await Address.findOne({ userId: res.user.id });
    if (!myAddress) throw new Error("user address not found");
    res.status(200).json({
      myAddress,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};

exports.getUserAddress = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userAddress = await Address.findOne({ userId: id });
    if (!userAddress) throw new Error(" Address not found");
    res.status(200).json({
      userAddress,
    });
  } catch (error) {
    res.status(400);
    next(error);
  }
};
