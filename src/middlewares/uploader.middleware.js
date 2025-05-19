
const multer  = require('multer')

const myStorage = multer.diskStorage({
    destination: function (req, file, cb) {},
    filename: function (req, file, cb) {},
})


const uploader = () => {

    const uploadConfig = {
        fileSize: 10 * 1024 * 1024, // 10 MB
        fileFilter: function (req, file, cb) {}
    }

    return multer({
        storage: myStorage,
        fileFilter: uploadConfig.fileFilter,
        limits: {
            fileSize: uploadConfig.fileSize
        }
    });
}

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