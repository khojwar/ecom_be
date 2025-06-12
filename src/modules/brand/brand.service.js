const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service")
const BrandModel = require("./brand.model");

class BrandService extends BaseService {
    async transformBrandCreateData(req) {
        try {
            const data = req.body;
            
            data.createdBy = req.loggedInUser._id; // user id from auth middleware
            
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

    async transformBrandUpdateData(req, oldData) {
        try {
            const data = req.body;            
            data.updatedBy = req.loggedInUser._id; // user id from auth middleware

             // upload to cloudinary 
            if (req.file) {
                data.logo = await cloudinarySvc.fileUpload(req.file.path, '/brand/')
            } else {
                data.logo = oldData.logo; // keep the old logo if not updated
            }

            return data;

        } catch (exception) {
            throw exception
        }
    }

    publicBrandData = (row) => {
                return {
                    _id: row._id,
                    name: row.name,
                    status: row.status,
                    slug: row.slug,
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

    async listAllRowsByFilter(query, filter = {}) {
        try {
            const page = +query.page || 1;
            const limit = +query.limit || 10;
            const skip = (page - 1) * limit;

            const data = await this.model.find(filter)
                .populate('createdBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .populate('updatedBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .sort({createdAt: "desc"})
                .skip(skip)
                .limit(limit)
            
            const count = await this.model.countDocuments(filter);

            return {
                data: data.map(this.publicBrandData),
                pagination: {
                    current: page,
                    limit: limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    }
            };


        } catch (exception) {
            throw exception;
        }
    }

    async deleteSingleRowByFilter(filter) {
        try {
            const deletedData = await this.model.findOneAndDelete(filter);
            return deletedData;
        } catch (exception) {
            throw exception;
            
        }
    }
}

const brandSvc = new BrandService(BrandModel)
module.exports = brandSvc;