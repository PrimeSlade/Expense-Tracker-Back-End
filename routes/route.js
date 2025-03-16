const {Router} = require('express');
const register = require('../controllers/register');
const login = require('../controllers/login');

//activate route
const route = Router();

route.post('/signup', register);
route.post('/login',login);


module.exports = route;