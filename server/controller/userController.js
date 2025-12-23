const { getUsers, getUserById, changeUserRole } = require('../service/userService');
const Role = require('../model/Role');

const getUsersHandler=async(req,res)=>{
    try{
        const users=await getUsers();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

const getUserByIdHandler=async(req,res)=>{
    try{
        const { id } = req.params;
        const user=await getUserById(id);
        res.status(200).json(user);
    }catch(err){
        res.status(404).json({ error: err.message });
    }
};

const changeUserRoleHandler=async(req,res)=>{
    try{
        const { id } = req.params;
        const { role} = req.body;
        const user=await changeUserRole(id,role);
        res.status(200).json({
            message:'User role updated successfully',
            user
        });
    }catch(err){
        res.status(400).json({ error: err.message });
    }
};

module.exports={
    getUsersHandler,
    getUserByIdHandler,
    changeUserRoleHandler
};
