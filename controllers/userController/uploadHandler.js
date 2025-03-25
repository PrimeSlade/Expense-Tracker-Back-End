require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadHandler = async (req, res) => {
  try {
    const filePath = req.file.path; // Get the file path from the uploaded file

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "expense-tracker-profile",
    });

    // Remove the local image file after upload (it waits the result becoz of the await keyword)
    fs.unlinkSync(filePath);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = uploadHandler;
