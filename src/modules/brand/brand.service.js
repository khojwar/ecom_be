const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service")
const BrandModel = require("./brand.model");

class BrandService extends BaseService {
    async transformBrandCreateData(req) {
        try {
            const data = req.body;
            console.log("req.loggedInUser: ", req.loggedInUser);
            
            data.createdBy = req.loggedInUser._id; // user id from auth middleware
            data.updatedBy = req.loggedInUser._id; // user id from auth middleware

             // upload to cloudinary 
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

    publicBrandData = (row) => {
                return {
                    _id: row._id,
                    name: row.name,
                    slug: row.status,
                    logo: row.logo.optimizedUrl,
                    createdBy: {
                        _id: row.createdBy._id,
                        name: row.createdBy.name,
                        email: row.createdBy.email,
                        role: row.createdBy.role,
                        status: row.createdBy.status,
                        image: row.createdBy.image.optimizedUrl
                    },
                }
            }

    async listAllRowsByFilter() {
        try {
            const data = await this.model.find()
                .populate('createdBy', ['_id', 'email', 'image', 'role', 'status'])
                .populate('updatedBy', ['_id', 'email', 'image', 'role', 'status'])
            
            return data.map(this.publicBrandData);


        } catch (exception) {
            throw exception;
        }
    }

    update() {}
    view() {}
    delete() {}
}

const brandSvc = new BrandService(BrandModel)
module.exports = brandSvc;