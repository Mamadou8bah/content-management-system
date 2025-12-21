const mongoose=require('mongoose');

const articleSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:false
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    status:{
        type:String,
        enum:['draft','published','archived'],
        default:'draft'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    publishedAt:{
        type:Date,
        default:null
    },
    publishedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

const Article=mongoose.model('Article',articleSchema);

module.exports=Article;