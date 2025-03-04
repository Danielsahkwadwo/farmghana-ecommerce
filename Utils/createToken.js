const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET_TOKEN, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  return token;
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

module.exports = {
  createToken,
  hashToken,
};
