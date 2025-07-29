const { options } = require("joi");
const brandSvc = require("./brand.service");
const { message } = require("laravel-mix/src/Log");
const productSvc = require("../product/product.service");
const { Status } = require("../../config/constant");

class BrandController {

    /**
     * CRUD operations for brands
     * read by url (string-slug => /:id, /:slug)
     */

    createBrand = async (req, res, next) => {
        try {
            const payload  = await brandSvc.transformBrandCreateData(req)
            const brand = await brandSvc.create(payload);
            
            res.json({
                data: brand,
                message: "Brand created successfully",
                status: "Ok",
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }

    async listAllBrands (req, res, next) {
        try {
            let filter = {};
            if (req.query.search) {
                filter = {
                    ...filter,
                    name: new RegExp(req.query.search, 'i') 
                }
            }

            if (req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }

            const {data, pagination} = await brandSvc.listAllRowsByFilter(req.query, filter);
            
            res.json({
                data: data,
                message: "All brand data",
                status: "BRAND_LIST_SUCCESS",
                options: {pagination}
            })
        } catch (exception) {
            next(exception);
        }
    }

    // async #getBrandDetail(brandId) {
    //     this.#brandDetail = await brandSvc.getSingleRowByFilter({
    //         _id: brandId
    //     });

    //     if (!this.#brandDetail) {
    //         throw {
    //             code: 422,
    //             message: "Brand does not exist",
    //             status: "BRAND_NOT_FOUND"
    //         }
    //     }
    // }

    async getBrandDetailsById (req, res, next) {
        try {
            const brandId = req.params.brandId;
            const brandDetail = await brandSvc.getSingleRowByFilter({
                _id: brandId
            });

            if (!brandDetail) {
                throw {
                    code: 422,
                    message: "Brand does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }
            res.json({
                data: brandDetail,
                message: "Brand details",
                status: "BRAND_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);   
        }
    }
    
    async updateBrandById (req, res, next) {
        try {
            let brandId = req.params.brandId;

            const brandDetail = await brandSvc.getSingleRowByFilter({ _id: brandId });

            if (!brandDetail) {
                throw {
                    code: 422,
                    message: "Brand does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            // console.log("brandDetail: ", brandDetail);
            
            const payload = await brandSvc.transformBrandUpdateData(req, brandDetail);
            const update = await brandSvc.updateSingleRowByFilter({"_id": brandDetail._id}, payload);

            res.json({
                data: update,
                message: "Brand updated successfully",
                status: "BRAND_UPDATED",
                options: null
            })
            
        } catch (exception) {
            // console.log("updateBrandById exception: ", exception);
            next(exception);  
        }
    }

    async deleteBrandById (req, res, next) {
        try {
            const brandId = req.params.brandId;
            const brandDetail = await brandSvc.getSingleRowByFilter({ _id: brandId });

            if (!brandDetail) {
                throw {
                    code: 422,
                    message: "Brand does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            console.log("brandDetail: ", brandDetail);

            const deletedRow = await brandSvc.deleteSingleRowByFilter({ _id: brandId });

            res.json({
                data: deletedRow,
                message: "Brand deleted successfully",
                status: "BRAND_DELETED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
        }
    }

    async getBrandDetailWithProducts (req, res, next) {
        try {
            const slug = req.params.slug;
            const brandDetail = await brandSvc.getSingleRowByFilter({ slug: slug });

            if (!brandDetail) {
                throw {
                    code: 422,
                    message: "Brand does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            // TODO: Product
            const filter = {
                brand: {$in: [brandDetail._id]},          // $in – Matches any of the values in an array
                status: Status.ACTIVE
            }

            const {data: products, pagination} = await productSvc.listAllRowsByFilter(req.query, filter);

            res.json({
                data: {
                    brandDetail: brandDetail,
                    products: products,
                },
                message: "Brand details with products",
                status: "BRAND_DETAILS_FETCHED",
                options: {pagination}
            })
            
        } catch (exception) {
            next(exception);
            
        }
    }

}


const brandCtr = new BrandController();
module.exports = brandCtr;