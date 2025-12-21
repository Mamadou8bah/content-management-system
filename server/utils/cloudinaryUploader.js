const cloudinary=require('../config/cloudinartConfig')
const streamifier=require('streamifier')


const uploadToCloudinary= (fileBuffer, folder='app_uploads')=>{
    return new Promise((resolve,reject)=>{
        const stream= cloudinary.uploader.upload_stream(
            {folder},
            (error,result)=>{
                if(error){
                    reject(error);
                }else{
                    resolve(result);
                }
            }
        );
        streamifier.createReadStream(fileBuffer).pipe(stream);
    })
}

const deleteFromCloudinary= async(publicId)=>{
    try{
        await cloudinary.uploader.destroy(publicId)
    }catch(error){
        console.error('Error deleting from Cloudinary:',error)
    }
}

module.exports={uploadToCloudinary,deleteFromCloudinary}