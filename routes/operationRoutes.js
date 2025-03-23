const {Router} = require('express');
const requireAuth = require('../middleware/requireAuth');
const create = require('../controllers/listController/create');
const deleteList = require('../controllers/listController/deleteList');
const edit = require('../controllers/listController/edit');
const editUser = require('../controllers/userController/editUser');
const displayLists = require('../controllers/listController/displayLists');
const editCurrency = require('../controllers/userController/editCurrency');

const operationRoute = Router();

//use auth middle in every route
operationRoute.use(requireAuth);

operationRoute.post('/create',create);
operationRoute.delete('/delete',deleteList);
operationRoute.put('/edit',edit);
operationRoute.put('/editUser',editUser.info);
operationRoute.put('/editPassword',editUser.password);
operationRoute.get('/list',displayLists);
operationRoute.put('/currency',editCurrency);


module.exports = operationRoute;