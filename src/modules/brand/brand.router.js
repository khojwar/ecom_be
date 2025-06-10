const brandRouter = require("express").Router();
const { USER_ROLES } = require("../../config/constant.js");
const auth = require("../../middlewares/auth.middleware.js");
const bodyValidator = require("../../middlewares/request-validate.middleware.js");
const uploader = require("../../middlewares/uploader.middleware.js");
const { BrandCreateDTO } = require("./brand.validator.js");
const brandCtr = require("./brand.controller.js");


// brandRouter.post("/create", brandCtr.createBrand);
// brandRouter.put("/update/:id", brandCtr.updateBrand);
// brandRouter.get("/list", brandCtr.listAllBrands);
// brandRouter.get("/view/:id", brandCtr.viewBrandDetails);
// brandRouter.delete("/delete/:id", brandCtr.deleteBrand);
// brandRouter.get("/read/:slug", brandCtr.readbyUrl);



// brandRouter.post("/")
// brandRouter.get("/")

brandRouter.route("/")
    .post(auth([USER_ROLES.ADMIN]), uploader().single('logo'), bodyValidator(BrandCreateDTO), brandCtr.createBrand)
    .get(brandCtr.listAllBrands)
module.exports = brandRouter;