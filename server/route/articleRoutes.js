const {
    createArticleHandler,
    getArticleByIdHandler,
    getArticlesHandler,
    updateArticleHandler,
    softDeleteArticleHandler,
    restoreArticleHandler,
    publishArticleHandler
}= require('../controller/articleController');
const express=require('express');
const Router=express.Router();
const {
    authenticateToken,
    authz
}=require('../midleware/authMiddlewares');
const upload=require('../midleware/uploadMidleware');

Router.post('/',authenticateToken,authz('create_article'),upload.single('image'),createArticleHandler);
Router.get('/:id',authenticateToken,authz('view_article'),getArticleByIdHandler);
Router.get('/',authenticateToken,authz('view_article'),getArticlesHandler);
Router.put('/:id',authenticateToken,authz('edit_article'),updateArticleHandler);
Router.delete('/:id',authenticateToken,authz('delete_article'),softDeleteArticleHandler);
Router.put('/:id/restore',authenticateToken,authz('restore_article'),restoreArticleHandler);
Router.put('/:id/publish',authenticateToken,authz('publish_article'),publishArticleHandler);

module.exports=Router;


