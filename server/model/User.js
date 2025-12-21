const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    roleId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Role'
    },
    profilePhotoUrl:{
        type:String,
        default:null
    },
    isActive:{
        type:Boolean,
        default:true
    },
    refreshTokens:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'RefreshToken'
    }],
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
})

const User=mongoose.model('User',userSchema);

module.exports=User;