const express = require("express");
const multer = require("multer");
const { userAuth } = require("../middlewares/auth");
const { cloudinary, hasCloudinaryConfig } = require("../config/cloudinary");

const uploadRouter = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed."));
    }
    cb(null, true);
  },
});

uploadRouter.post(
  "/upload/profile-photo",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!hasCloudinaryConfig) {
        return res.status(500).json({
          message:
            "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
        });
      }

      if (!req.file) {
        return res.status(400).json({ message: "Photo file is required." });
      }

      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "devtinder/profile-photos",
        resource_type: "image",
        transformation: [{ width: 720, height: 720, crop: "limit", quality: "auto:good" }],
      });

      return res.json({
        message: "Photo uploaded successfully.",
        photoUrl: result.secure_url,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || "Failed to upload photo.",
      });
    }
  }
);

module.exports = uploadRouter;
