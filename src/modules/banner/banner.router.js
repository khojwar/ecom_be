const bannerRouter = require("express").Router();
const { USER_ROLES } = require("../../config/constant.js");
const auth = require("../../middlewares/auth.middleware.js");
const bodyValidator = require("../../middlewares/request-validate.middleware.js");
const uploader = require("../../middlewares/uploader.middleware.js");
const { BannerCreateDTO, BannerUpdateDTO } = require("./banner.validator.js");
const bannerCtr = require("./banner.controller.js");



bannerRouter.route("/")
    .post(auth([USER_ROLES.ADMIN]), uploader().single('image'), bodyValidator(BannerCreateDTO), bannerCtr.createBanner)
    .get(bannerCtr.listAllBanners)

bannerRouter.route("/:bannerId")
    .get(bannerCtr.getBannerDetailsById)
    .put(auth([USER_ROLES.ADMIN]), uploader().single('image'), bodyValidator(BannerUpdateDTO), bannerCtr.updateBannerById)
    .delete(auth([USER_ROLES.ADMIN]), bannerCtr.deleteBannerById)


module.exports = bannerRouter;