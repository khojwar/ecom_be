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
                secureUrl: secure_url,
                publicId: public_id,
                optimizedUrl: optimized,
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