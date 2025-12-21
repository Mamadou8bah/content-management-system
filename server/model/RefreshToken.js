const mongoose=require('mongoose');

const refreshTokenSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tokenId:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    tokenHash:{
        type:String,
        required:true
    },
    isRevoked:{
        type:Boolean,
        default:false
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{
    timestamps:true
});

module.exports=mongoose.model('RefreshToken',refreshTokenSchema);