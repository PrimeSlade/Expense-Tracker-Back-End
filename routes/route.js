const {Router} = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');
const logout = require('../controllers/logout');

//activate route
const route = Router();

route.post('/signup', register);
route.post('/login',login);
route.post('/logout',logout);

module.exports = route;