const cloudinary = require("cloudinary").v2;

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dlvaxaov8",
  api_key: process.env.CLOUDINARY_API_KEY || 343233353946623,
  api_secret:
    process.env.CLOUDINARY_API_SECRET || "pgqNd0m_NXh4CNrDtB33NYtyfWY",
});
// console.log(process.env.CLOUDINARY_API_KEY)

module.exports = cloudinary;
