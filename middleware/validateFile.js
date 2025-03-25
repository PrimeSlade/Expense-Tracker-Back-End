const path = require("path");

const validateFile = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const fileExt = path.extname(file.originalname).toLowerCase(); //which will only display .png,.jpeg
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
  if (!allowedExtensions.includes(fileExt)) {
    return res
      .status(400)
      .json({ error: "Invalid file type. Only image files are allowed." });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return res.status(400).json({ error: "File size exceeds 5MB limit" });
  }

  next(); // If validation passes, move to the next middleware or route handler
};

module.exports = validateFile;
