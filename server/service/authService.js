const User = require('../model/User');
const cloudinaryUploader = require('../utils/cloudinaryUploader');
const bcrypt = require('bcrypt');
const jwtService=require('../utils/jwtService')
const dotenv = require('dotenv');
dotenv.config();
const RefreshToken=require('../model/RefreshToken');
const jwt=require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const register = async (userData, image) => {
  const userExist = await User.findOne({ email: userData.email });
  if (userExist){
    return res.status(400).json({ error: 'Email already in use' });
  };

  if (!userData.password) throw new Error('Password is required');


  const saltRounds = parseInt(process.env.SALT_ROUNDS, 10) || 10;
  

  let uploadPromise = null;
  if (image) {
    uploadPromise = cloudinaryUploader.uploadToCloudinary(image).catch(err => {
      console.error('Cloudinary upload failed', err);
      throw new Error('Failed to upload profile photo');
    });
  }
  const passwordHashPromise = bcrypt.hash(userData.password, saltRounds);

  const [passwordHash, uploadResult] = await Promise.all([passwordHashPromise, uploadPromise]);

  const newUser = new User({
    fullname: userData.fullname || userData.fullName,
    email: userData.email.toLowerCase(),
    password: passwordHash,
    roleId: userData.roleId,
    profilePhotoUrl: uploadResult ? uploadResult.secure_url : null
  });

  await newUser.save();

  const userToReturn = newUser.toObject();
  delete userToReturn.password;
  return userToReturn;
};

const login= async(email,password)=>{
  const user= await User.findOne({email:email.toLowerCase()}).populate('roleId');
  if(!user) throw new Error('Invalid email or password');
  const passwordMatch= await bcrypt.compare(password,user.password);
  if(!passwordMatch) throw new Error('Invalid email or password');

  const tokenId=uuidv4();
  const refreshToken=jwtService.generateRefreshToken(user,tokenId);
  const tokenHash=await bcrypt.hash(refreshToken,10);

  const expiresAt=new Date(Date.now()+7*24*60*60*1000);

  await RefreshToken.create({
    userId:user._id,
    tokenId:tokenId,
    tokenHash:tokenHash,
    isRevoked:false,
    expiresAt:expiresAt
  });

  return {
    accessToken:jwtService.generateAccessToken(user),
    refreshToken:refreshToken,
    role:user.roleId.name
  };
};

const logout= async(refreshToken)=>{
  const payload=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

  const storedToken= await RefreshToken.findOne({
    tokenId:payload.tokenId
  });

  if(!storedToken) throw new Error('Invalid refresh token');

  storedToken.isRevoked=true;
  await storedToken.save();

  return { message: 'Logged out successfully' };
};

const revokeToken= async(refreshToken)=>{
  const payload=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

  const storedToken= await RefreshToken.findOne({
    tokenId:payload.tokenId
  });

  if(!storedToken) throw new Error('Invalid refresh token');

  storedToken.isRevoked=true;
  await storedToken.save();

  return { message: 'Token revoked successfully' };
};

const getAccessToken= async(refreshToken)=>{
  const payload=jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

  const storedToken= await RefreshToken.findOne({
    tokenId:payload.tokenId,
    isRevoked:false
  });

  if(!storedToken) throw new Error('Invalid refresh token');

  const isMatch=await bcrypt.compare(refreshToken,storedToken.tokenHash);
  if(!isMatch) throw new Error('Invalid refresh token');

  const user= await User.findById(payload.userId);
  if(!user) throw new Error('User not found');

  const newAccessToken=jwtService.generateAccessToken(user);
  return { accessToken:newAccessToken };
};

module.exports = { register, login, logout, revokeToken, getAccessToken };