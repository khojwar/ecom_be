const { USER_ROLES } = require("../../config/constant");
const auth = require("../../middlewares/auth.middleware");
const bodyValidator = require("../../middlewares/request-validate.middleware.js")
const orderDetailRouter = require("./detail/order-detail.router");
const orderCtr = require("./order.controller");
const { CheckoutDTO } = require("./order.validator");
const orderRouter = require("express").Router();

orderRouter.use('/detail', orderDetailRouter);  

orderRouter.post('/checkout', auth([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]), bodyValidator(CheckoutDTO), orderCtr.checkout);
orderRouter.get('/payment/:orderCode', auth([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]), orderCtr.initiatePayment);
orderRouter.put('/payment/:orderCode', auth([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]), orderCtr.updatePaymentDetails);

// view orders
orderRouter.get('/', auth([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]), orderCtr.listAllOrders);
orderRouter.get('/:orderCode', auth([USER_ROLES.ADMIN, USER_ROLES.CUSTOMER]), orderCtr.viewOrderDetails);

module.exports = orderRouter;