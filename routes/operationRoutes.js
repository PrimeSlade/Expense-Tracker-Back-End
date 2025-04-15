const { Router } = require("express");
const requireAuth = require("../middleware/requireAuth");
const create = require("../controllers/listController/create");
const deleteList = require("../controllers/listController/deleteList");
const edit = require("../controllers/listController/edit");
const editUser = require("../controllers/userController/editUser");
const displayLists = require("../controllers/listController/displayLists");
const editCurrency = require("../controllers/userController/editCurrency");
const addAmount = require("../controllers/userController/addAmount");
const uploadImg = require("../controllers/userController/uploadHandler");
const multer = require("multer");
const validateFile = require("../middleware/validateFile");

const operationRoute = Router();

const storage = multer.diskStorage({
  destination: "uploads/", // Temporary file storage
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Create Multer upload middleware
const upload = multer({ storage });

//use auth middle in every route
operationRoute.use(requireAuth);

operationRoute.post("/lists/create", create);
operationRoute.delete("/lists/remove/:id", deleteList);
operationRoute.put("/lists/update/:id", edit);
operationRoute.put("/user/update", editUser.info);
operationRoute.put("/user/password", editUser.password);
operationRoute.get("/lists/view", displayLists);
operationRoute.patch("/user/currency/update", editCurrency);
operationRoute.patch("/user/amount/add", addAmount);
operationRoute.post(
  "/user/profile/upload",
  upload.single("img"),
  validateFile,
  uploadImg
);

module.exports = operationRoute;
