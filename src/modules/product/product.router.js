const productRouter = require("express").Router();
const { USER_ROLES } = require("../../config/constant.js");
const auth = require("../../middlewares/auth.middleware.js");
const bodyValidator = require("../../middlewares/request-validate.middleware.js");
const uploader = require("../../middlewares/uploader.middleware.js");
const { ProductCreateDTO, ProductUpdateDTO } = require("./product.validator.js");
const productCtr = require("./product.controller.js");


productRouter.get("/by-slug/:slug", productCtr.getProductDetailWithProducts);
productRouter.get("/list-all-products", productCtr.listAllProductsForPublic);

productRouter.route("/")
    .post(auth([USER_ROLES.ADMIN, USER_ROLES.SELLER]), uploader().array('images'), bodyValidator(ProductCreateDTO), productCtr.createProduct)
    .get(auth([USER_ROLES.ADMIN, USER_ROLES.SELLER]), productCtr.listAllProducts)

productRouter.route("/:productId")
    .get(productCtr.getProductDetailsById)
    .put(auth([USER_ROLES.ADMIN, USER_ROLES.SELLER]), uploader().array('images'), bodyValidator(ProductUpdateDTO), productCtr.updateProductById)
    .delete(auth([USER_ROLES.ADMIN, USER_ROLES.SELLER]), productCtr.deleteProductById)


module.exports = productRouter;