console.log("🔥 Cloudinary upload middleware loaded");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "cyber-crime-evidence",
    allowed_formats: ["jpg", "jpeg", "png"],
    public_id: (req, file) => {
      return Date.now() + "-" + Math.round(Math.random() * 1e9);
    }
  }
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    file.originalname.toLowerCase().split(".").pop()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

module.exports = upload;