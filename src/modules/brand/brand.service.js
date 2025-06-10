const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service")
const BrandModel = require("./brand.model");

class BrandService extends BaseService {
    async transformBrandCreateData(req) {
        try {
            const data = req.body;
            data.createdBy = req.loggedInUser._id;

            if (req.file) {
                data.logo = await cloudinarySvc.fileUpload(req.file.path, '/brand/')
            }

            // slug 
            // task: str => special characters => lowercase => replace spaces with hyphens or underscores
            // TOOL: (slugify) -> returns a text into one long word containing nothing but lower case ASCII characters and hyphens (-). Meaning: - All spaces converted into hyphens. - Removing all characters that are not aphanumeric, except hyphens and underscores.

            data.slug = slugify(data.name.replace("'","").replace('"',''), {
                lower: true,
            })

            return data;

        } catch (exception) {
            throw exception
        }
    }

    read() {}

    update() {}

    delete() {}
}

const brandSvc = new BrandService(BrandModel)
module.exports = brandSvc;