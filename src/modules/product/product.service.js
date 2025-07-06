const { default: slugify } = require("slugify");
const BaseService = require("../../services/base.service");
const cloudinarySvc = require("../../services/cloudinary.service")
const ProductModel = require("./product.model");
const { randomStringGenerator } = require("../../utilities/helper");
const userSvr = require("../user/user.service")
const categorySvr = require("../categories/category.service")
const brandSvc = require("../brand/brand.service");

class ProductService extends BaseService {
    async transformProductCreateData(req) {
        try {
            const data = req.body;
            
            data.createdBy = req.loggedInUser._id; // user id from auth middleware

            // there can be same product's name, so we need to create a unique slug
            // slugify the name and append a random string to it
            data.slug = slugify(data.name.replace("+","-").replace("'","").replace('"','')+"-"+randomStringGenerator(7), {
                lower: true,
            })

            data.price = data.price * 100; // converting rupees to paisa

            data.afterDiscount = data.price - (data.price * (data.discount / 100));

            data.seller = req.loggedInUser._id; // logged in user is the seller

            if (data.category === "" || data.category === null) {
                data.category = null; 
            } 

            // for foreign key brand, if brands is empty or null, set it to null
            if (data.brand === "" || data.brand === null) {
                data.brand = null;
            }

            // upload to cloudinary
            // we are uploading multiple files. but cloudinarySvc.fileUpload will only upload one file at a time

            // to handle this, we use promise function
            // kunai pani promise laai "await" garena bhane, "pending" state mai baschha

            if (req.files) {
                let images = [];
                data.images = [];

                req.files.map((image) => {
                    let uploadResponse = cloudinarySvc.fileUpload(image.path, '/product/');
                    images.push(uploadResponse);
                })

                const uploadedStatus = await Promise.allSettled(images);    // allSettled will return an array of objects with status and value
                uploadedStatus.map((cloudinaryUploadSuccess) => {
                    if (cloudinaryUploadSuccess.status === 'fulfilled') { 
                        data.images.push(cloudinaryUploadSuccess);
                    } 
                })
            }
            
            return data;

        } catch (exception) {
            throw exception
        }
    }

    async transformProductUpdateData(req, oldData) {
        try {
            const data = req.body;
            
            data.updatedBy = req.loggedInUser._id; // user id from auth middleware

            data.price = data.price * 100; // converting rupees to paisa

            data.afterDiscount = data.price - (data.price * (data.discount / 100));

            if (data.category === "" || data.category === null) {
                data.category = null; 
            } 

            // for foreign key brands, if brands is empty or null, set it to null
            if (data.brand === "" || data.brand === null) {
                data.brand = null;
            }

            // upload to cloudinary
            // we are uploading multiple files. but cloudinarySvc.fileUpload will only upload one file at a time

            // to handle this, we use promise function
            // kunai pani promise laai "await" garena bhane, "pending" state mai baschha

            // if (req.files) {
            //     let images = [];
            //     data.images = [...oldData.images]; // keep the old images

            //     req.files.map((image) => {
            //         let uploadResponse = cloudinarySvc.fileUpload(image.path, '/product/');
            //         images.push(uploadResponse);
            //     })

            //     const uploadedStatus = await Promise.allSettled(images);    // allSettled will return an array of objects with status and value
            //     uploadedStatus.map((cloudinaryUploadSuccess) => {
            //         if (cloudinaryUploadSuccess.status === 'fulfilled') { 
            //             data.images.push(cloudinaryUploadSuccess.value); // push the value of the fulfilled promise
            //         } 
            //     })
            // }


            if (req.files || req.body.deletedImages) {
                let images = [];

                // Clone the old images
                data.images = [...oldData.images];

                // Step 1: Handle deleted images
                if (req.body.deletedImages && Array.isArray(req.body.deletedImages)) {
                    // Filter out images that need to be deleted
                    const deletedImages = req.body.deletedImages;

                    // Remove the deleted images from data.images
                    data.images = data.images.filter(image => !deletedImages.includes(image.public_id));

                    // Optionally delete them from Cloudinary
                    await Promise.allSettled(
                        deletedImages.map(public_id => cloudinarySvc.fileDelete(public_id))
                    );
                }

                // Step 2: Upload new images
                if (req.files) {
                    req.files.map((image) => {
                        let uploadResponse = cloudinarySvc.fileUpload(image.path, '/product/');
                        images.push(uploadResponse);
                    });

                    const uploadedStatus = await Promise.allSettled(images);

                    uploadedStatus.map((cloudinaryUploadSuccess) => {
                        if (cloudinaryUploadSuccess.status === 'fulfilled') {
                            data.images.push(cloudinaryUploadSuccess.value);
                        }
                    });
                }
            }

            
            return data;

        } catch (exception) {
            throw exception
        }
    }

    publicProductData = (row) => {
                return {
                    _id: row._id,
                    name: row.name,
                    slug: row.slug,
                    description: row.description,
                    price: row.price,
                    discount: row.discount,
                    afterDiscount: row.afterDiscount,
                    tag: row.tags,
                    stock: row.stock,
                    attributes: row.attributes,
                    sku: row.sku,
                    homeFeature: row.homeFeature,
                    status: row.status,
                    seller: row?.seller && userSvr.getUserPublicProfile(row.seller),
                    category: row.category && row.category.map(cat => (categorySvr.publicCategoryData(cat))),
                    brand: row.brand && brandSvc.publicBrandData(row.brand),
                    images: row.images.map(image => image?.optimizedUrl),
                    createdBy: row?.createdBy && userSvr.getUserPublicProfile(row.createdBy),
                    updatedBy: row?.updatedBy && userSvr.getUserPublicProfile(row.updatedBy)

                    // seller: {
                    //     _id: row.seller._id,
                    //     name: row.seller.name,
                    //     email: row.seller.email,
                    //     role: row.seller.role,
                    //     status: row.seller.status,
                    //     image: row.seller.image.optimizedUrl
                    // },
                    // category: row.category.map(cat => ({
                    //     _id: cat?._id,
                    //     name: cat?.name,
                    //     slug: cat?.slug,
                    //     icon: cat?.icon?.optimizedUrl,
                    //     status: cat?.status
                    // })),
                    // brand: {
                    //     _id: row.brand._id,
                    //     name: row.brand.name,
                    //     slug: row.brand.slug,
                    //     logo: row.brand?.logo?.optimizedUrl,
                    //     status: row.brand.status
                    // },
                    // images: row.images.map(image => ({
                    //     url: image.optimizedUrl,
                    // })),
                    // createdBy: {
                    //     _id: row.createdBy._id,
                    //     name: row.createdBy.name,
                    //     email: row.createdBy.email,
                    //     role: row.createdBy.role,
                    //     status: row.createdBy.status,
                    //     image: row.createdBy.image.optimizedUrl
                    // },
                    // updatedBy: {
                    //     _id: row.updatedBy._id,
                    //     name: row.updatedBy.name,
                    //     email: row.updatedBy.email,
                    //     role: row.updatedBy.role,
                    //     status: row.updatedBy.status,
                    //     image: row.updatedBy.image.optimizedUrl
                    // },
                }
            }

    async listAllRowsByFilter(query, filter = {}) {
        try {
            const page = +query.page || 1;
            const limit = +query.limit || 10;
            const skip = (page - 1) * limit;

            const data = await this.model.find(filter)
                .populate('brand', ['_id', 'name', 'slug', 'logo', 'status'])
                .populate('category', ['_id', 'name', 'slug', 'icon', 'status'])
                .populate('seller', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .populate('createdBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .populate('updatedBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .sort({createdAt: "desc"})
                .skip(skip)
                .limit(limit)
            
            const count = await this.model.countDocuments(filter);

            return {
                data: data.map(this.publicProductData),
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

const productSvc = new ProductService(ProductModel)
module.exports = productSvc;