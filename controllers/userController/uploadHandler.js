require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const knex = require("../../knex/knex");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const uploadHandler = async (req, res) => {
  try {
    const id = req.user;
    const filePath = req.file.path; // Get the file path from the uploaded file

    //find if the img alr exists
    const [img] = await knex
      .select("public_id")
      .from("users")
      .where({ id: id });

    //if exists
    if (img.public_id) {
      await cloudinary.uploader.destroy(img.public_id);
      console.log("deleted");
    }

    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "expense-tracker-profile",
    });

    // Remove the local image file after upload (it waits the result becoz of the await keyword)
    fs.unlinkSync(filePath);

    //insert
    const [{ img_url }] = await knex("users")
      .update({
        img_url: result.secure_url,
        public_id: result.public_id,
      })
      .where({
        id: id,
      })
      .returning("img_url");

    res.status(200).json(img_url);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
};

module.exports = uploadHandler;
