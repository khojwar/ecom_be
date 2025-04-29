const ProductRouter = require('express').Router();
const ProductController = require('./product.controller.js');


const productCtr = new ProductController();

ProductRouter.post("/create", productCtr.createProduct);
ProductRouter.get('/list', productCtr.listAllProduct);
ProductRouter.get('/view/:id', productCtr.viewProductDetails);
ProductRouter.put('/update/:id', productCtr.updateProduct);
ProductRouter.delete('/delete/:id', productCtr.deleteProduct);
ProductRouter.get("/read/:slug", productCtr.readByUrl)

module.exports = ProductRouter;