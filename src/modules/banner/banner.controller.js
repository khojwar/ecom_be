const { options } = require("joi");
const bannerSvc = require("./banner.service");
const productSvc = require("../product/product.service");
const { Status } = require("../../config/constant");
const { Op } = require("sequelize");

class BannerController {

    createBanner = async (req, res, next) => {        
        try {
            const payload  = await bannerSvc.transformBannerCreateData(req)
            console.log("payload: ", payload);
            const banner = await bannerSvc.create(payload);

            console.log("banner: ", banner);
            
            
            res.json({
                data: banner,
                message: "Banner created successfully",
                status: "Ok",
                options: null
            })
        } catch (exception) {
            console.log("createBanner exception: ", exception);
            next(exception);
        }
    }

    async listAllBanners (req, res, next) {
        try {
            let filter = {};
            if (req.query.search) {
                filter.title = {
                    [Op.iLike]: `%${req.query.search}%`
                };
            }

            if (req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }

            const {data, pagination} = await bannerSvc.listAllRowsByFilter(req.query, filter);
            
            res.json({
                data: data,
                message: "All banner data",
                status: "BANNER_LIST_SUCCESS",
                options: {pagination}
            })
        } catch (exception) {
            throw exception;
        }
    }


    async getBannerDetailsById (req, res, next) {
        try {
            const bannerId = req.params.bannerId;
            const bannerDetail = await bannerSvc.getSingleRowByFilter({
                _id: bannerId
            });

            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner does not exist",
                    status: "BANNER_NOT_FOUND"
                }
            }
            res.json({
                data: bannerDetail,
                message: "Banner details",
                status: "BANNER_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);   
        }
    }
    
    async updateBannerById (req, res, next) {
        try {
            let bannerId = req.params.bannerId;

            const bannerDetail = await bannerSvc.getSingleRowByFilter({ _id: bannerId });

            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner does not exist",
                    status: "BANNER_NOT_FOUND"
                }
            }

            // console.log("bannerDetail: ", bannerDetail);
            
            const payload = await bannerSvc.transformBannerUpdateData(req, bannerDetail);
            const update = await bannerSvc.updateSingleRowByFilter({"_id": bannerDetail._id}, payload);

            res.json({
                data: update,
                message: "Banner updated successfully",
                status: "BANNER_UPDATED",
                options: null
            })
            
        } catch (exception) {
            // console.log("updateBannerById exception: ", exception);
            next(exception);  
        }
    }

    async deleteBannerById (req, res, next) {
        try {
            const bannerId = req.params.bannerId;
            const bannerDetail = await bannerSvc.getSingleRowByFilter({ _id: bannerId });

            if (!bannerDetail) {
                throw {
                    code: 422,
                    message: "Banner does not exist",
                    status: "BANNER_NOT_FOUND"
                }
            }

            console.log("bannerDetail: ", bannerDetail);

            const deletedRow = await bannerSvc.deleteSingleRowByFilter({ _id: bannerId });

            res.json({
                data: deletedRow,
                message: "Banner deleted successfully",
                status: "BANNER_DELETED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
        }
    }


}


const bannerCtr = new BannerController();
module.exports = bannerCtr;