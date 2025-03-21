const {Router} = require('express');
const requireAuth = require('../middleware/requireAuth');
const create = require('../controllers/create');
const deleteList = require('../controllers/deleteList');
const edit = require('../controllers/edit');

const operationRoute = Router();

//use auth middle in every route
operationRoute.use(requireAuth);

operationRoute.post('/create',create);
operationRoute.delete('/delete',deleteList);
operationRoute.put('/edit',edit);

module.exports = operationRoute;