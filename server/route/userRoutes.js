const express=require('express');
const Router=express.Router();

const { authenticateToken, authz } = require('../midleware/authMiddlewares');

const {
    getUsersHandler,
    getUserByIdHandler,
    changeUserRoleHandler
}=require('../controller/userController');

Router.get('/',authenticateToken, authz('view_users'), getUsersHandler);
Router.get('/:id',authenticateToken, authz('view_users'), getUserByIdHandler);
Router.put('/:id',authenticateToken, authz('change_user_role'), changeUserRoleHandler);
 
module.exports=Router;
