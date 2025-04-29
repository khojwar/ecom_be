const brandRouter = require("express").Router();
const { BrandController } = require("./brand.controller");

const brandCtr = new BrandController();

brandRouter.post("/create", brandCtr.createBrand);
brandRouter.put("/update/:id", brandCtr.updateBrand);
brandRouter.get("/list", brandCtr.listAllBrands);
brandRouter.get("/view/:id", brandCtr.viewBrandDetails);
brandRouter.delete("/delete/:id", brandCtr.deleteBrand);
brandRouter.get("/read/:slug", brandCtr.readbyUrl);


module.exports = brandRouter;