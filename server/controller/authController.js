const {register,login,logout,getAccessToken,revokeToken}=require('../service/authService')
const {getUserById}=require('../service/userService')

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
        if (err.message === 'Invalid email or password') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.status(500).json({ error: err.message });
    }
}

async function getLoggedInUser(req,res){
    try{
        const userId=req.user.id;
        const user= await getUserById(userId);
        res.status(200).json({
            user:user
        })
    }catch(err){
        res.status(401).json({
            error: err.message
        })
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
        console.log('Refresh token request received');
        const {refreshToken}=req.body;
        if (!refreshToken) {
            console.log('No refresh token provided');
            return res.status(400).json({ error: 'Refresh token is required' });
        }
        const result= await getAccessToken(refreshToken);
        console.log('New access token generated');
        res.status(200).json(result);
    }catch(err){
        console.error('Error refreshing token:', err.message);
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
    revokeTokenForUser,
    getLoggedInUser
}