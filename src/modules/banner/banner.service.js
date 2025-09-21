
const cloudinarySvc = require("../../services/cloudinary.service")
const BannerModel = require("./banner.model");

class BannerService {
    async transformBannerCreateData(req) {
        try {
            const data = req.body;

            // upload to cloudinary
            if (req.file) {
                data.image = await cloudinarySvc.fileUpload(req.file.path, '/banner/')
            }

            return data;

        } catch (exception) {
            throw exception
        }
    }

    async transformBannerUpdateData(req, oldData) {
        try {
            const data = req.body;            

             // upload to cloudinary 
            if (req.file) {
                data.image = await cloudinarySvc.fileUpload(req.file.path, '/banner/')
            } else {
                data.image = oldData.image; // keep the old image if not updated
            }

            return data;

        } catch (exception) {
            throw exception
        }
    }

    publicBannerData = (row) => {
                return {
                    _id: row._id,
                    title: row.title,
                    url: row.link,
                    status: row.status,
                    image: row.image.optimizedUrl,
                }
            }

    async listAllRowsByFilter(query, filter = {}) {
        try {
            const page = +query.page || 1;
            const limit = +query.limit || 10;
            const skip = (page - 1) * limit;


            const {rows: data, count} = await BannerModel.findAndCountAll({
                where: filter,
                offset: skip,                           // Skip the first (page - 1) * limit records
                limit: limit,
                order: [['createdAt', 'DESC']],         // Sort by createdAt in descending order
            })

            return {
                data: data.map(this.publicBannerData),
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

    async create(data) {
        try {
            const createdData = await BannerModel.create(data);
            return createdData;
        } catch (exception) {
            throw exception;
        }
    }

    async getSingleRowByFilter(filter) {
        try {
            const data = await BannerModel.findOne({
                where: filter,

                // foreign ko data taanna laai use hunxa (mongoose maa populate use garinxa)
                // include: [{
                //     source: 'image',
                //     attributes: ['optimizedUrl', 'publicId']

                // }]
            });
            return data;
        } catch (exception) {
            throw exception;
        }
    }

    async updateSingleRowByFilter(filter, data) {
        try {
            const [updatedCount, rows] = await BannerModel.update(data, {
                where: filter,
                returning: ["_id", "title", "status", "image", "createdAt"]
            });
            return rows[0];

        } catch (exception) {
            throw exception;
        }
    }

    async deleteSingleRowByFilter(filter) {
        try {
            const deletedData = await BannerModel.destroy({
                where: filter
            });
            return deletedData;
        } catch (exception) {
            throw exception;
            
        }
    }
}

const bannerSvc = new BannerService()
module.exports = bannerSvc;