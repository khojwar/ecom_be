const { options } = require("joi");
const categorySvc = require("./category.service");
const { message } = require("laravel-mix/src/Log");

class CategoryController {
    createCategory = async (req, res, next) => {
        try {
            const payload  = await categorySvc.transformCategoryCreateData(req)
            const category = await categorySvc.create(payload);
            
            res.json({
                data: category,
                message: "Category created successfully",
                status: "Ok",
                options: null
            })
        } catch (exception) {
            next(exception);
        }
    }

    async listAllCategories (req, res, next) {
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

            if (+req.query.showInMenu === 1) {           // + converts string to number
                filter = {
                    ...filter,
                    showInMenu: true
                }
            } else if (+req.query.showInMenu === 0) {
                filter = {
                    ...filter,
                    showInMenu: false
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

            const {data, pagination} = await categorySvc.listAllRowsByFilter(req.query, filter);
            
            res.json({
                data: data,
                message: "All category data",
                status: "BRAND_LIST_SUCCESS",
                options: {pagination}
            })
        } catch (exception) {
            throw exception;
        }
    }

    async getCategoryDetailsById (req, res, next) {
        try {
            const categoryId = req.params.categoryId;
            const categoryDetail = await categorySvc.getSingleRowByFilter({
                _id: categoryId
            });

            if (!categoryDetail) {
                throw {
                    code: 422,
                    message: "Category does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }



            res.json({
                data: categoryDetail,
                message: "Category details",
                status: "BRAND_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);   
        }
    }
    
    async updateCategoryById (req, res, next) {
        try {
            let categoryId = req.params.categoryId;

            const categoryDetail = await categorySvc.getSingleRowByFilter({ _id: categoryId });

            if (!categoryDetail) {
                throw {
                    code: 422,
                    message: "Category does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            // console.log("categoryDetail: ", categoryDetail);
            
            const payload = await categorySvc.transformCategoryUpdateData(req, categoryDetail);
            const update = await categorySvc.updateSingleRowByFilter({"_id": categoryDetail._id}, payload);

            res.json({
                data: update,
                message: "Category updated successfully",
                status: "BRAND_UPDATED",
                options: null
            })
            
        } catch (exception) {
            // console.log("updateCategoryById exception: ", exception);
            next(exception);  
        }
    }

    async deleteCategoryById (req, res, next) {
        try {
            const categoryId = req.params.categoryId;
            const categoryDetail = await categorySvc.getSingleRowByFilter({ _id: categoryId });

            if (!categoryDetail) {
                throw {
                    code: 422,
                    message: "Category does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            console.log("categoryDetail: ", categoryDetail);

            const deletedRow = await categorySvc.deleteSingleRowByFilter({ _id: categoryId });

            res.json({
                data: deletedRow,
                message: "Category deleted successfully",
                status: "BRAND_DELETED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
        }
    }

    async getCategoryDetailWithProducts (req, res, next) {
        try {
            const slug = req.params.slug;
            const categoryDetail = await categorySvc.getSingleRowByFilter({ slug: slug });

            if (!categoryDetail) {
                throw {
                    code: 422,
                    message: "Category does not exist",
                    status: "BRAND_NOT_FOUND"
                }
            }

            // TODO: Product

            res.json({
                data: {
                    categoryDetail: categoryDetail,
                    products: null,
                },
                message: "Category details with products",
                status: "BRAND_DETAILS_FETCHED",
                options: null
            })
            
        } catch (exception) {
            next(exception);
            
        }
    }

}


const categoryCtr = new CategoryController();
module.exports = categoryCtr;