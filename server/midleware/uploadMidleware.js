const multer=require('multer')

const storage=multer.memoryStorage()

const upload=multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024  // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed'))
        }
    }
})

module.exports=upload;