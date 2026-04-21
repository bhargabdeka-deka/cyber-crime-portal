const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Handle invalid MongoDB ObjectId
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format"
    });
  }

  // Handle Multer errors (file size, etc)
  if (err.name === "MulterError") {
    let msg = err.message;
    if (err.code === "LIMIT_FILE_SIZE") msg = "File is too large. Max limit is 5MB.";
    return res.status(400).json({
      success: false,
      message: msg
    });
  }

  const statusCode = err.statusCode || (res.statusCode === 200 ? 500 : res.statusCode) || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
};

module.exports = errorHandler;
