const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
const User=require('../model/User');
const Role=require('../model/Role')
dotenv.config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const userId = payload.sub;
        User.findById(userId).then(user => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        }).catch(err => {
            
            return res.status(500).json({ message: 'Error looking up user', error: err.message });
        });
    } catch (err) {
        
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

const loadPermissions=async(req,res,next)=>{
    try{
        const user=req.user;
        if(!user?.roleId){
            return res.status(403).json({message:'Role not assigned'});
        }
        const role=await Role.findById(user.roleId).populate('permissions','key')

        if(!role) return res.status(404).json({message:'Invalid Role'});

        req.user.role=role;
        req.user.permissions=role.permissions.map(p=>p.key)
        next();
    }catch(error){
        return res.status(404).json({err:error})
    }
    
}

function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.permissions) {
      return res.status(403).json({ message: 'Permissions not loaded' });
    }

    if (!req.user.permissions.includes(permission)) {
      return res.status(403).json({
        message: `Missing permission: ${permission}`
      });
    }

    next();
  };
};

const authz = (permission) => [
  authenticateToken,
  loadPermissions,
  requirePermission(permission)
];

module.exports={
    authenticateToken,
    authz
}