## Cloudinary Setup configuration

we need three things:

1. api key
2. api secret
3. cloud name


## how to get api key?

steps:

    Programmable media -> dashboard -> go to api key -> generate new api key


## create `src/config/config.js` to read the env file. So, we got the central file.

    require("dotenv").config();

    const AppConfig = {
    CloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    CloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    CloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    };

    module.exports = {
    AppConfig,
    };


## create `src/serviecs/cloudinary.service.js`

    const { AppConfig } = require('../config/config');
    const { deleteFile } = require('../utilities/helper');


    const cloudinary = require('cloudinary').v2;

    class CloudinaryService {
        constructor() {
            cloudinary.config({
                cloud_name: AppConfig.CloudinaryCloudName,
                api_key: AppConfig.CloudinaryApiKey,
                api_secret: AppConfig.CloudinaryApiSecret,
            })
        }

        // Uploads an image file
        fileUpload = async (filePath, dir='/') => {
            try {
                // Upload the image
                const { secure_url, url, public_id} = await cloudinary.uploader.upload(filePath, {
                    unique_filename: true,
                    folder: "/api-42" + dir,
                    resource_type: "auto",
                });

                // delete the file from local storage
                deleteFile(filePath);


                // optimize the image
                const optimized = cloudinary.url(public_id, {         // cloudinary.url() is used to generate the URL of the image, cloudinary.image() is used to generate the image tag
                    transformation: [
                        { width: 500, crop: "scale" },               // crop: fill || limit || scale || fit 
                        { quality: "auto", fetch_format: "auto" },
                    ],
                });

                return {
                    secure_url,
                    public_id,
                    optimized_url: optimized,
                };

            } catch (exception) {
                console.log(exception);
                throw {
                    code: 500,
                    message: "File upload error in cloudinary",
                    status: "FILE_UPLOAD_ERROR",
                }
            }
        }

    }

    const cloudinarySvc = new CloudinaryService();
    module.exports = cloudinarySvc


## `src/modules/auth/auth.controller.js`

    registerUser = async (req, res, next) => {

        try {
                    const data = req.body;    // file data is not coming in req.body
            
                    // const file = req.file;   // single file data is coming in req.file        // {path: '', filename: '', mimetype: '', size: '', ....}
            
                    // const files = req.files;   // muliple file data is coming in req.files  
                    
                    data.image = await cloudinarySvc.fileUpload(req.file.path, '/user/');
                    
            
                    res.status(200).json({
                        data: data,
                        // data: req.user,
                        message: "You are register",
                        status: "Success",
                        options: null,
                    })
        } catch (exception) {
            next(exception);
        }
     }




