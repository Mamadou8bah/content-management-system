const {register,login,logout,getAccessToken,revokeToken}=require('../service/authService')

async function registerUser(req,res){
    try{
        const userData=req.body;
        const imageBuffer=req.file ? req.file.buffer : null;
        const newUser=await register(userData,imageBuffer);
        delete newUser.password;
        res.status(201).json({
            message:'User registered successfully',
            user:newUser
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function loginUser(req,res){
    try{
        const {email,password}=req.body;
        const tokens= await login (email,password);
        res.status(200).json({
            message:'Login successful',
            ...tokens
        });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function logoutUser(req,res){
    try{
        const {refreshToken}=req.body;
        const result= await logout(refreshToken);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

async function getAccessTokenForUser(req,res){
    try{
        const {refreshToken}=req.body;
        const result= await getAccessToken(refreshToken);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
async function revokeTokenForUser(req,res){
    try{
        const {refreshToken}=req.body;
        const result= await revokeToken(refreshToken);
        res.status(200).json(result);
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports={
    registerUser,
    loginUser,
    logoutUser,
    getAccessTokenForUser,
    revokeTokenForUser
}