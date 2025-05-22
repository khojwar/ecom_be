require("dotenv").config();

const AppConfig = {
  CloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  CloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

module.exports = {
  AppConfig,
};
