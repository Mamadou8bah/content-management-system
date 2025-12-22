const express=require('express')

const upload=require('../midleware/uploadMidleware')

const {authenticateToken}=require('../midleware/authMiddlewares')
const Router=express.Router()
const {
    registerUser, 
    loginUser,
    logoutUser,
    getAccessTokenForUser,
    revokeTokenForUser,
    getLoggedInUser
}=require('../controller/authController')

Router.post('/register',upload.single('avatar'),registerUser)
Router.post('/login',loginUser)
Router.post('/logout',authenticateToken,logoutUser)
Router.post('/refresh',getAccessTokenForUser)
Router.post('/revoke-token',authenticateToken,revokeTokenForUser)
Router.get('/me',authenticateToken,getLoggedInUser)

module.exports=Router;