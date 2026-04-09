const { v2: cloudinary } = require("cloudinary");

const requiredKeys = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];

const hasNamedKeyConfig = requiredKeys.every(
  (key) => !!process.env[key] && String(process.env[key]).trim() !== ""
);
const hasUrlConfig =
  !!process.env.CLOUDINARY_URL &&
  String(process.env.CLOUDINARY_URL).trim().startsWith("cloudinary://");

const hasCloudinaryConfig = hasNamedKeyConfig || hasUrlConfig;

if (hasCloudinaryConfig) {
  if (hasNamedKeyConfig) {
    cloudinary.config({
      cloud_name: String(process.env.CLOUDINARY_CLOUD_NAME).trim(),
      api_key: String(process.env.CLOUDINARY_API_KEY).trim(),
      api_secret: String(process.env.CLOUDINARY_API_SECRET).trim(),
    });
  } else {
    cloudinary.config({
      cloudinary_url: String(process.env.CLOUDINARY_URL).trim(),
    });
  }
}

module.exports = {
  cloudinary,
  hasCloudinaryConfig,
};
