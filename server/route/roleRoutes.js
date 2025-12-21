const express = require('express');
const Router = express.Router();

const {
    createRoleHandler,
    getRolesHandler,
    getRoleByIdHandler,
    updateRoleHandler,
    deleteRoleHandler,
    setRolePermissionsHandler
} = require('../controller/roleController');

Router.post('/', createRoleHandler);
Router.get('/', getRolesHandler);
Router.get('/:id', getRoleByIdHandler);
Router.put('/:id', updateRoleHandler);
Router.delete('/:id', deleteRoleHandler);
Router.put('/:id/permissions', setRolePermissionsHandler);

module.exports = Router;
