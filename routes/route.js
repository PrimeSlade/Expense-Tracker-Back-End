const {Router} = require('express');
const register = require('../controllers/authController/register');
const login = require('../controllers/authController/login');
const logout = require('../controllers/authController/logout');

//activate route
const route = Router();

route.post('/signup', register);
route.post('/login',login);
route.post('/logout',logout);

module.exports = route;