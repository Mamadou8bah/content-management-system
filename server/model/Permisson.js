const mongoose=require('mongoose');

const permisionSchema=new mongoose.Schema({
    key:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

const Permission=mongoose.model('Permission',permisionSchema);

module.exports=Permission;