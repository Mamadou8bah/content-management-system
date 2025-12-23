const express = require('express');
const Router = express.Router();

const { getPermissionsHandler } = require('../controller/permissionController');

Router.get('/', getPermissionsHandler);

module.exports = Router;
