const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service")
const CategoryModel = require("./category.model");

class CategoryService extends BaseService {
    async transformCategoryCreateData(req) {
        try {
            const data = req.body;
            
            data.createdBy = req.loggedInUser._id; // user id from auth middleware
            
            // upload to cloudinary 
            if (req.file) {
                data.logo = await cloudinarySvc.fileUpload(req.file.path, '/brand/')
            }

            if (data.parentId === "" || data.parentId === null) {
                data.parentId = null; 
            } 

            if (data.brands === "" || data.brands === null) {
                data.brands = null;
            }

            data.slug = slugify(data.name.replace("'","").replace('"',''), {
                lower: true,
            })

            return data;

        } catch (exception) {
            throw exception
        }
    }

    async transformCategoryUpdateData(req, oldData) {
        try {
            const data = req.body;            
            data.updatedBy = req.loggedInUser._id; // user id from auth middleware

             // upload to cloudinary 
            if (req.file) {
                data.logo = await cloudinarySvc.fileUpload(req.file.path, '/brand/')
            } else {
                data.logo = oldData.logo; // keep the old logo if not updated
            }

            if (data.parentId === "" || data.parentId === null) {
                data.parentId = null; 
            } 

            if (data.brands === "" || data.brands === null) {
                data.brands = null;
            }

            return data;

        } catch (exception) {
            throw exception
        }
    }

    publicCategoryData = (row) => {
                return {
                    _id: row._id,
                    name: row.name,
                    status: row.status,
                    slug: row.slug,
                    parentId: {
                        _id: row?.parentId?._id,
                        name: row?.parentId?.name,
                        slug: row?.parentId?.slug,
                        icon: row?.parentId?.icon?.optimizedUrl,
                        status: row?.parentId?.status
                    },
                    brands: row?.brands?.map(brand => ({
                        _id: brand._id,
                        name: brand.name,
                        slug: brand.slug,
                        logo: brand?.logo?.optimizedUrl,
                        status: brand.status
                    })),
                    icon: row?.icon?.optimizedUrl,
                    createdBy: {
                        _id: row?.createdBy?._id,
                        name: row?.createdBy?.name,
                        email: row?.createdBy?.email,
                        role: row?.createdBy?.role,
                        status: row?.createdBy?.status,
                        image: row?.createdBy?.image?.optimizedUrl
                    },
                }
            }

    async listAllRowsByFilter(query, filter = {}) {
        try {
            const page = +query.page || 1;
            const limit = +query.limit || 10;
            const skip = (page - 1) * limit;

            const data = await this.model.find(filter)
                .populate('brands', ['_id', 'name', 'slug', 'logo', 'status'])
                .populate('parentId', ['_id', 'name', 'slug', 'icon', 'status'])
                .populate('createdBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .populate('updatedBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .sort({createdAt: "desc"})
                .skip(skip)
                .limit(limit)
            
            const count = await this.model.countDocuments(filter);

            return {
                data: data.map(this.publicCategoryData),
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

const brandSvc = new CategoryService(CategoryModel)
module.exports = brandSvc;