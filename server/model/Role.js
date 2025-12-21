const mongoose=require('mongoose');

const RoleSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    permissions:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Permission'
    }],
    isSystemRole:Boolean,
    createdAt:{
        type:Date,
        default:Date.now
    }
},{
    timestamps:true
});

const Role=mongoose.model('Role',RoleSchema);

module.exports=Role;