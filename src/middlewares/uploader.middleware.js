
const multer  = require('multer')
const fs = require('fs')
const {randomStringGenerator} = require('../utilities/helper')

const myStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const filePath = "./public/uploads/" 

        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true })
        }

        cb(null, filePath)
    },
    filename: function (req, file, cb) {
        let fileName = randomStringGenerator(15) + "-" + file.originalname
        cb(null, fileName)
    },
})

// middleware
const uploader = (type = 'image') => {

    const uploadConfig = {
        fileSize: 10 * 1024 * 1024, // 10 MB
        fileFilter: function (req, file, cb) {
            let allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'svg','bmp', 'webp']

            if (type === 'video') {
                this.fileSize = 500000   // 500 MB
                allowedExts = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv']
            } else if (type === 'audio') {
                this.fileSize = 1000000   // 1 GB
                allowedExts = ['mp3', 'wav', 'ogg', 'aac']
            } else if (type === 'document') {
                this.fileSize = 5000000   // 5 MB
                allowedExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
            }

            const fileExt = file.originalname.split('.').pop().toLowerCase()

            if (allowedExts.includes(fileExt)) {
                cb(null, true)
            } else {
                // if extension is not allowed, call the exception handler to delete the file
                // this file redirects to express.config.js file's exception handler
                cb({ code: 422, message: 'File format not supported', status: "INVALID_FILE_FORMAT" })
            }
        }
    }

    return multer({
        storage: myStorage,
        fileFilter: uploadConfig.fileFilter,
        limits: {
            fileSize: uploadConfig.fileSize
        }
    });
}

module.exports = uploader;




// const uploaderInst = uploader()
// --------- 4 methods for file upload ------------------
// 1. file not upload, parse multipart/form-data
// uploaderInst.none()
// 2. upload single file from form-data
// uploaderInst.single("fieldName")
// 3. upload multiple files from form-data
// uploaderInst.array("fieldName", 10)
// 4. multiple fields for uploading multiple types
// uploaderInst.fields([
//     { name: "fieldName1", maxCount: 10 },
//     { name: "fieldName2", maxCount: 5 },
// ])