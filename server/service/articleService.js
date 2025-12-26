const Article=require('../model/Article');
const User=require('../model/User');
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
const publishArticle=async(id,userId)=>{
    const article=await Article.findById(id);
    const user=await User.findById(userId).populate('roleId');
    if(user.roleId.name==='Contributor'){
        throw new Error('Unauthorized to publish articles');
    }
    if(!article || article.isDeleted) throw new Error('Article not found');
    article.status='published';
    article.publishedAt=new Date();
    await article.save();
    return article.populate('author');
}
const getArticleById=async(id)=>{

    console.log('Fetching article with ID:', id);
    const article=await Article.findById(id).populate('author').populate('publishedBy');
    if(!article || article.isDeleted) throw new Error('Article not found');
    console.log('Found article:', article);
    return article;
};

const getArticles=async(filter={})=>{
    console.log('Fetching articles with filter:', filter);
    const query={ isDeleted:false };
    if(filter.status) query.status=filter.status;
    if(filter.author) query.author=filter.author;
    return Article.find(query).populate('author').populate('publishedBy').sort({ createdAt:-1 });
};

const updateArticle=async(id,updates,userId)=>{


    
    const article=await Article.findById(id);
    const updatingUser=await User.findById(userId).populate('roleId');

    if(updatingUser.roleId.name==='Contributor' && !userId.equals(article.author._id)){

        throw new Error('Unauthorized to update this article');
    }
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

const softDeleteArticle=async(id,userId)=>{
    
    const article=await Article.findById(id);
    const updatingUser=await User.findById(userId).populate('roleId');

    if(updatingUser.roleId.name==='Contributor' && !userId.equals(article.author._id)){

        throw new Error('Unauthorized to delete this article');
    }
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
