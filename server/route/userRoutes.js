const express=require('express');
const Router=express.Router();

const { authenticateToken, authz } = require('../midleware/authMiddlewares');

const {
    getUsersHandler,
    getUserByIdHandler,
    changeUserRoleHandler
}=require('../controller/userController');

Router.get('/', authz('view_users'), getUsersHandler);
Router.get('/:id', authz('view_users'), getUserByIdHandler);
Router.put('/:id/role', authz('change_user_role'), changeUserRoleHandler);

module.exports=Router;
