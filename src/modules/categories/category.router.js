const categoryRouter = require("express").Router();
const { USER_ROLES } = require("../../config/constant.js");
const auth = require("../../middlewares/auth.middleware.js");
const bodyValidator = require("../../middlewares/request-validate.middleware.js");
const uploader = require("../../middlewares/uploader.middleware.js");
const { CategoryCreateDTO, CategoryUpdateDTO } = require("./category.validator.js");
const categoryCtr = require("./category.controller.js");


// categoryRouter.post("/create", categoryCtr.createCategory);
// categoryRouter.put("/update/:id", categoryCtr.updateCategory);
// categoryRouter.get("/list", categoryCtr.listAllCategorys);
// categoryRouter.get("/view/:id", categoryCtr.viewCategoryDetails);
// categoryRouter.delete("/delete/:id", categoryCtr.deleteCategory);
// categoryRouter.get("/read/:slug", categoryCtr.readbyUrl);


// TODO:
categoryRouter.get("/by-slug/:slug", categoryCtr.getCategoryDetailWithProducts);

categoryRouter.route("/")
    .post(auth([USER_ROLES.ADMIN]), uploader().single('icon'), bodyValidator(CategoryCreateDTO), categoryCtr.createCategory)
    .get(categoryCtr.listAllCategories)

categoryRouter.route("/:categoryId")
    .get(categoryCtr.getCategoryDetailsById)
    .put(auth([USER_ROLES.ADMIN]), uploader().single('icon'), bodyValidator(CategoryUpdateDTO), categoryCtr.updateCategoryById)
    .delete(auth([USER_ROLES.ADMIN]), categoryCtr.deleteCategoryById)


module.exports = categoryRouter;