const {Router} = require('express');
const requireAuth = require('../middleware/requireAuth');
const create = require('../controllers/create');

const operationRoute = Router();

operationRoute.use(requireAuth);
operationRoute.post('/create',create);

module.exports = operationRoute;