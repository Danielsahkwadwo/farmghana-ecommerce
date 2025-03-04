const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    if (!token) {
      throw new Error("Please login to continue");
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    const currentUser = await User.findById(decode.id).select("-password");
    if (!currentUser) {
      res.status(404);
      throw new Error("user not found");
    }
    //denying suspended user access
    if (currentUser.role === "suspended") {
      throw new Error("User suspended, please contact support");
    }
    // console.log(decode);

    res.user = currentUser;
    next();
  } catch (error) {
    res.status(403);
    next(error);
  }
};