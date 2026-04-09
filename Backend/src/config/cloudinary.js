const { v2: cloudinary } = require("cloudinary");

const requiredKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const hasCloudinaryConfig = requiredKeys.every(
  (key) => !!process.env[key] && String(process.env[key]).trim() !== ""
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

module.exports = {
  cloudinary,
  hasCloudinaryConfig,
};
