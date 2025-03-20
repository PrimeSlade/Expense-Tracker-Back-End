const {Router} = require('express');
const requireAuth = require('../middleware/requireAuth');
const create = require('../controllers/create');
const deleteList = require('../controllers/deleteList');

const operationRoute = Router();

operationRoute.use(requireAuth);
operationRoute.post('/create',create);
operationRoute.delete('/delete',deleteList);

module.exports = operationRoute;