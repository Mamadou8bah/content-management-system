const Article=require('../model/Article');

const cloudinaryUploader=require('../utils/cloudinaryUploader');

const createArticle=async(data,image)=>{
    if(image){
        const results=await cloudinaryUploader.uploadToCloudinary(image);
        data.imageUrl=results.secure_url;
    }
    const article=new Article({
        title:data.title,
        content:data.content,
        imageUrl:data.imageUrl || null,
        author:data.author,
        publishedBy:data.publishedBy || null
    });

    await article.save();
    return article;
};
const publishArticle=async(id)=>{
    const article=await Article.findById(id);
    if(!article || article.isDeleted) throw new Error('Article not found');
    article.status='published';
    article.publishedAt=new Date();
    await article.save();
    return article.populate('author');
}
const getArticleById=async(id)=>{
    const article=await Article.findById(id).populate('author').populate('publishedBy');
    if(!article || article.isDeleted) throw new Error('Article not found');
    return article;
};

const getArticles=async(filter={})=>{
    const query={ isDeleted:false };
    if(filter.status) query.status=filter.status;
    if(filter.author) query.author=filter.author;
    return Article.find(query).populate('author').populate('publishedBy').sort({ createdAt:-1 });
};

const updateArticle=async(id,updates)=>{
    const article=await Article.findById(id);
    if(!article || article.isDeleted) throw new Error('Article not found');

    if(updates.title !== undefined) article.title=updates.title;
    if(updates.content !== undefined) article.content=updates.content;
    if(updates.status !== undefined) {
        article.status=updates.status;

        
        if(updates.status !== 'published'){
            article.publishedAt=null;
            article.publishedBy=null;
        }
    }

    if(updates.status === 'published' && !article.publishedAt){
        article.publishedAt=new Date();
        if(updates.publishedBy) article.publishedBy=updates.publishedBy;
    }

    await article.save();
    return article.populate('author').populate('publishedBy');
};

const softDeleteArticle=async(id)=>{
    const article=await Article.findById(id);
    if(!article || article.isDeleted) throw new Error('Article not found');
    article.isDeleted=true;
    await article.save();
    return { message:'Article deleted successfully' };
};

const restoreArticle=async(id)=>{
    const article=await Article.findById(id);
    if(!article || !article.isDeleted) throw new Error('Article not found');
    article.isDeleted=false;
    await article.save();
    return article;
};

module.exports={
    createArticle,
    getArticleById,
    getArticles,
    updateArticle,
    softDeleteArticle,
    restoreArticle,
    publishArticle
};
