const User=require('../model/User');
const Role=require('../model/Role');

const getUsers=async()=>{
    return User.find().populate('roleId');
};

const getUserById=async(id)=>{
    const user=await User.findById(id).populate('roleId');
    if(!user) throw new Error('User not found');
    return user;
};

const changeUserRole=async(userId,roleId)=>{
    const user=await User.findById(userId);
    if(!user) throw new Error('User not found');

    const role=await Role.findById(roleId);
    if(!role) throw new Error('Role not found');

    user.roleId=role._id;
    await user.save();

    return user.populate('roleId');
};

module.exports={
    getUsers,
    getUserById,
    changeUserRole
};
