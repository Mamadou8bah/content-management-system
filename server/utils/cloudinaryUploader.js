const cloudinary=require('../config/cloudinaryConfig')
const streamifier=require('streamifier')


const uploadToCloudinary= (fileBuffer, folder='app_uploads')=>{
    return new Promise((resolve,reject)=>{
        const stream= cloudinary.uploader.upload_stream(
            {
                folder,
                eager: [
                    {width: 300, height: 300, crop: "fill", quality: "auto", fetch_format: "auto"},
                    {width: 1000, height: 1000, crop: "scale", quality: "auto", fetch_format: "auto"}
                ],
                quality: "auto",
                fetch_format: "auto"
            },
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