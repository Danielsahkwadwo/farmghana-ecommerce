const multer = require("multer");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `users-${Date.now()}-${file.originalname}`);
  },
});

const productStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(
      null,
      `products-${Date.now()}-${Math.round(Math.random() * 10000)}-${
        file.originalname
      }`
    );
  },
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};
const uploadUserImage = multer({
  storage: storage,
  limits: { fileSize: "1024 * 1024" },
  fileFilter: multerFilter,
});
const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: "1024 * 1024" },
  fileFilter: multerFilter,
});
module.exports = {
  uploadUserImage,
  uploadProductImage,
};
