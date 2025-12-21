const Role=require('../model/Role');

const createRole=async(name,permissions=[],isSystemRole=false)=>{
    const existing=await Role.findOne({name:name});
    if(existing) throw new Error('Role already exists');

    const role=new Role({
        name:name,
        permissions:permissions,
        isSystemRole:isSystemRole
    });

    await role.save();
    return role;
};

const getRoles=async()=>{
    return Role.find().populate('permissions');
};

const getRoleById=async(id)=>{
    const role=await Role.findById(id).populate('permissions');
    if(!role) throw new Error('Role not found');
    return role;
};

const updateRole=async(id,updates)=>{
    const role=await Role.findByIdAndUpdate(id,updates,{new:true}).populate('permissions');
    if(!role) throw new Error('Role not found');
    return role;
};

const deleteRole=async(id)=>{
    const role=await Role.findById(id);
    if(!role) throw new Error('Role not found');
    if(role.isSystemRole) throw new Error('Cannot delete a system role');
    await Role.findByIdAndDelete(id);
    return { message:'Role deleted successfully' };
};

const setRolePermissions=async(id,permissionIds)=>{
    const role=await Role.findById(id);
    if(!role) throw new Error('Role not found');
    role.permissions=permissionIds;
    await role.save();
    return role.populate('permissions');
};

module.exports={
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
    setRolePermissions
};
