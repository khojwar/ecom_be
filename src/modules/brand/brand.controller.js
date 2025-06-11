const { options } = require("joi");
const brandSvc = require("./brand.service");
const { message } = require("laravel-mix/src/Log");

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
            throw exception;
        }
    }





    // updateBrand = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const { name, slug } = req.body;
    //         const brand = await this.brandService.updateBrand(id, { name, slug });
    //         return res.status(200).json(brand);
    //     } catch (error) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }

    // listAllBrands = async (req, res) => {
    //     try {
    //         const brands = await this.brandService.listAllBrands();
    //         return res.status(200).json(brands);
    //     } catch (error) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }

    // viewBrandDetails = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         const brand = await this.brandService.viewBrandDetails(id);
    //         return res.status(200).json(brand);
    //     } catch (error) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }


    // deleteBrand = async (req, res) => {
    //     try {
    //         const { id } = req.params;
    //         await this.brandService.deleteBrand(id);
    //         return res.status(204).send();
    //     } catch (error) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }

    // readbyUrl = async (req, res) => {
    //     try {
    //         const { slug } = req.params;
    //         const brand = await this.brandService.readByUrl(slug);
    //         return res.status(200).json(brand);
    //     } catch (error) {
    //         return res.status(500).json({ error: error.message });
    //     }
    // }

}


const brandCtr = new BrandController();
module.exports = brandCtr;