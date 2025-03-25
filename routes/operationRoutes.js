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

operationRoute.post("/create", create);
operationRoute.delete("/lists/:id", deleteList);
operationRoute.put("/lists/:id", edit);
operationRoute.put("/user", editUser.info);
operationRoute.put("/password", editUser.password);
operationRoute.get("/lists", displayLists);
operationRoute.patch("/currency", editCurrency);
operationRoute.patch("/amount", addAmount);
operationRoute.post("/upload", upload.single("img"), validateFile, uploadImg);

module.exports = operationRoute;
