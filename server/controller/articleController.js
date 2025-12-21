const {
    createArticle,
    getArticleById,
    getArticles,
    updateArticle,
    softDeleteArticle,
    restoreArticle,
    publishArticle
}= require('../service/articleService');

const createArticleHandler=async(req,res)=>{
    try{
        const articleData=req.body;
        const image=req.file.buffer;
        const article=await createArticle(articleData,image);
        res.status(201).json({
            message:'Article created successfully',
            article
        });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
};
const getArticleByIdHandler=async(req,res)=>{
    try{
        const {id}=req.params;
        const article=await getArticleById(id);
        res.status(200).json(article);
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};
const getArticlesHandler=async(req,res)=>{
    try{
        const filter=req.query;
        const articles=await getArticles(filter);
        res.status(200).json(articles);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

const updateArticleHandler=async(req,res)=>{
    try{
        const {id}=req.params;
        const updates=req.body;
        const article=await updateArticle(id,updates);
        res.status(200).json({
            message:'Article updated successfully',
            article
        });
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};

const softDeleteArticleHandler=async(req,res)=>{
    try{
        const {id}=req.params;
        const result=await softDeleteArticle(id);
        res.status(200).json(result);
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};
const restoreArticleHandler=async(req,res)=>{
    try{
        const {id}=req.params;
        const article=await restoreArticle(id);
        res.status(200).json({
            message:'Article restored successfully',
            article
        });
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};

const publishArticleHandler=async(req,res)=>{
    try{
        const {id}=req.params;
        const article=await publishArticle(id);
        res.status(200).json({
            message:'Article published successfully',
            article
        });
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};

module.exports={
    createArticleHandler,
    getArticleByIdHandler,
    getArticlesHandler,
    updateArticleHandler,
    softDeleteArticleHandler,
    restoreArticleHandler,
    publishArticleHandler
};