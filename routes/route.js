const { Router } = require("express");
const register = require("../controllers/authController/register");
const login = require("../controllers/authController/login");
const logout = require("../controllers/authController/logout");

//activate route
const route = Router();

route.post("/api/auth/signup", register);
route.post("/api/auth/login", login);
route.post("/api/auth/logout", logout);

module.exports = route;
