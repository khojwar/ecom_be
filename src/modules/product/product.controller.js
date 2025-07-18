const { options } = require("joi");
const productSvc = require("./product.service");
const { message } = require("laravel-mix/src/Log");
const { Status } = require("../../config/constant");

class ProductController {
    createProduct = async (req, res, next) => {
        try {
            const payload  = await productSvc.transformProductCreateData(req)
            const product = await productSvc.create(payload);
            
            res.json({
                data: product,
                message: "Product created successfully",
                status: "Ok",
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }

    async listAllProducts (req, res, next) {
        try {
            let filter = {};
            let loggedInUser = req.loggedInUser;

            console.log(loggedInUser);
            

            if (loggedInUser.role === "SELLER") {
                filter = {
                    ...filter,
                    seller: loggedInUser._id
                }
            }

            if (req.query.search) {
                filter = {
                    ...filter,
                    $or: [
                        {name: new RegExp(req.query.search, 'i')} ,
                        {description: new RegExp(req.query.search, 'i')},
                    ]
                }
            }

            if (req.query.status) {
                filter = {
                    ...filter,
                    status: req.query.status
                }
            }

            if (+req.query.homeFeature === 1) {           // + converts string to number
                filter = {
                    ...filter,
                    homeFeature: true
                }
            } else if (+req.query.homeFeature === 0) {
                filter = {
                    ...filter,
                    homeFeature: false
                }
            }

            const {data, pagination} = await productSvc.listAllRowsByFilter(req.query, filter);
            
            res.json({
                data: data,
                message: "All product data",
                status: "PRODUCT_LIST_SUCCESS",
                options: {pagination}
            })
        } catch (exception) {
            // console.log(exception);
            throw exception;
        }
    }

    async listAllProductsForPublic (req, res, next) {
        try {
            let filter = {
                status: Status.ACTIVE
            };

            if (req.query.search) {
                filter = {
                    ...filter,
                    $or: [
                        {name: new RegExp(req.query.search, 'i')} ,
                        {description: new RegExp(req.query.search, 'i')},
                    ]
                }
            }


            if (+req.query.homeFeature === 1) {           // + converts string to number
                filter = {
                    ...filter,
                    homeFeature: true
                }
            } else if (+req.query.homeFeature === 0) {
                filter = {
                    ...filter,
                    homeFeature: false
                }
            }

            const {data, pagination} = await productSvc.listAllRowsByFilter(req.query, filter);
            
            res.json({
                data: data,
                message: "All product data",
                status: "PRODUCT_LIST_SUCCESS",
                options: {pagination}
            })
        } catch (exception) {
            // console.log(exception);
            throw exception;
        }
    }

    async getProductDetailsById (req, res, next) {
        try {
            const productId = req.params.productId;
            const productDetail = await productSvc.getSingleRowByFilter({
                _id: productId
            });

            if (!productDetail) {
                throw {
                    code: 422,
                    message: "Product does not exist",
                    status: "PRODUCT_NOT_FOUND"
                }
            }

            res.json({
                data: productDetail,
                message: "Product details",
                status: "PRODUCT_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);   
        }
    }
    
    async updateProductById (req, res, next) {
        try {
            let productId = req.params.productId;

            const productDetail = await productSvc.getSingleRowByFilter({ _id: productId });

            if (!productDetail) {
                throw {
                    code: 422,
                    message: "Product does not exist",
                    status: "PRODUCT_NOT_FOUND"
                }
            }

            // console.log("productDetail: ", productDetail);
            
            const payload = await productSvc.transformProductUpdateData(req, productDetail);
            const update = await productSvc.updateSingleRowByFilter({"_id": productDetail._id}, payload);

            res.json({
                data: update,
                message: "Product updated successfully",
                status: "PRODUCT_UPDATED",
                options: null
            })
            
        } catch (exception) {
            console.log("updateProductById exception: ", exception);
            next(exception);  
        }
    }                                                               

    async deleteProductById (req, res, next) {
        try {
            const productId = req.params.productId;
            const productDetail = await productSvc.getSingleRowByFilter({ _id: productId });

            if (!productDetail) {
                throw {
                    code: 422,
                    message: "Product does not exist",
                    status: "PRODUCT_NOT_FOUND"
                }
            }

            console.log("productDetail: ", productDetail);

            const deletedRow = await productSvc.deleteSingleRowByFilter({ _id: productId });

            res.json({
                data: deletedRow,
                message: "Product deleted successfully",
                status: "PRODUCT_DELETED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
        }
    }

    async getProductDetailWithProducts (req, res, next) {
        try {
            const slug = req.params.slug;
            const productDetail = await productSvc.getSingleRowByFilter({ slug: slug });

            if (!productDetail) {
                throw {
                    code: 422,
                    message: "Product does not exist",
                    status: "PRODUCT_NOT_FOUND"
                }
            }

            // TODO: Product
            

            res.json({
                data: {
                    productDetail: productDetail,
                    products: null,
                },
                message: "Product details with products",
                status: "PRODUCT_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
            
        }
    }

    

}


const productCtr = new ProductController();
module.exports = productCtr;