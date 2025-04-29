const categoryRouter = require('express').Router();
const CategoryController = require('./category.controller.js');

const categoryCtr = new CategoryController();

categoryRouter.post('/create', categoryCtr.createCategory)
categoryRouter.get('/list', categoryCtr.listAllCategory)
categoryRouter.get('/view/:id', categoryCtr.viewCategoryDetails)
categoryRouter.put('/update/:id', categoryCtr.updateCategory)
categoryRouter.delete('/delete/:id', categoryCtr.deleteCategory)
categoryRouter.get('/read/:slug', categoryCtr.readByUrl)


module.exports = categoryRouter;