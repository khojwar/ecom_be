const orderDetailRouter = require('express').Router();
const orderDetailController = require('./order-detail.controller');
const auth = require('../../../middlewares/auth.middleware');
const { USER_ROLES } = require('../../../config/constant');
const authValidator = require('../../../middlewares/request-validate.middleware');
const { AddToCartDTO, DeleteFromCartDTO } = require('./order-detail.validator');

orderDetailRouter.post('/add', auth([USER_ROLES.ADMIN, USER_ROLES.SELLER, USER_ROLES.CUSTOMER]), authValidator(AddToCartDTO), orderDetailController.addToCart);
orderDetailRouter.get('/view', auth([USER_ROLES.ADMIN, USER_ROLES.SELLER, USER_ROLES.CUSTOMER]), orderDetailController.viewMyCart);
orderDetailRouter.delete('/remove', auth([USER_ROLES.ADMIN, USER_ROLES.SELLER, USER_ROLES.CUSTOMER]), authValidator(DeleteFromCartDTO), orderDetailController.deleteFromCart);

module.exports = orderDetailRouter;
