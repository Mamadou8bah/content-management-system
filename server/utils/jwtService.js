const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')

dotenv.config()

const generateAccessToken=(user)=>{
    return jwt.sign(
        {
            sub:user.id,
            email:user.email,
            role:user.role
        }
         ,process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_ACCESS_EXPIRES}
    )
}

const generateRefreshToken=(user,tokenId)=>{
    return jwt.sign(
        {
            userId:user._id,
            tokenId:tokenId
        },
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn:'7d'}
    )
}
    
module.exports={generateAccessToken,generateRefreshToken}