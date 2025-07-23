const { options } = require("joi");
const { message } = require("laravel-mix/src/Log");
const { ORDER_STATUS } = require("../../config/constant");
const orderDetailService = require("./detail/order-detail.service");
const { randomStringGenerator } = require("../../../utilities/helper");
const OrderSvc = require("./order.service");
const transactionSvc = require("./transaction/transaction.service");
const orderNotificationSvc = require("./order.mail");
const { data } = require("autoprefixer");

class OrderController {
    checkout = async (req, res, next) => {
        try {
           
            let { cartId, applyVoucher} = req.body;
            const loggedInUser = req.loggedInUser;

            let newCartId = [];
            // Ensure cartId is an array
            (new Set(cartId)).forEach((val) => {
                newCartId.push(val);
            });


            // Fetch cart items for the logged-in user
            const {data: cartInfo} = await orderDetailService.getAllRowsByFilter({
                _id: { $in: cartId },
                buyer: loggedInUser._id,
                order: {$eq: null}
            }, {})

            // If no cart items found, throw an error
            if (!cartInfo) {
                throw {
                    code: 422,
                    message: "Cart not found."
                }
            }

            // Check if the cart items are already in an order 
            let exists = [];
            let stockCheck = {};

            cartInfo.forEach((cartItem, index) => {
                if (newCartId.includes(cartItem._id.toString())) {
                    exists.push(cartItem);
                }

                if (cartItem.product.stock < cartItem.quantity) {
                    stockCheck[cartItem._id.toString()] =  "Insufficient stock for product: " + cartItem.product.name;
                }
            });

            if (Object.values(stockCheck).length > 0) {
                throw {
                    code: 422,
                    message: "Insufficient stock for some products.",
                    status: "INSUFFICIENT_STOCK_ERROR",
                    details: stockCheck
                };
            }

            // If the cart items do not exist in the order, throw an error
            if (exists.length !== newCartId.length) {
                throw {
                    code: 422,
                    message: "All cart items do not exist.",
                    status: "CART_NOT_FOUND_ERROR"
                }
            }


            const appliedVoucherDetails = null;
            const calculateValues = OrderSvc.calculateValues(cartInfo, appliedVoucherDetails);
            const orderDetail = OrderSvc.transformToOrder(calculateValues, loggedInUser);

            // Create a new order
            const order = await OrderSvc.createOrder(orderDetail);

            // orderDetailUpdate
            await orderDetailService.convertToOrder(order, cartInfo);

            // stock reduce
            await orderDetailService.reduceStock(cartInfo);

            // Create a transaction
            let transaction =  transactionSvc.transformToTransactionObject(order);
            await transactionSvc.createTransaction(transaction);

            await orderNotificationSvc.sendOrderDetailNotification(order, orderDetail);

            res.json({
                data: order,
                message: "Your order has been placed successfully.",
                status: "ORDER_PLACED_SUCCESS",
                options: null
            })



        } catch (exception) {
            next(exception);  
        }
    }

    initiatePayment  = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }

    updatePaymentDetails = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }

    listAllOrders = async (req, res, next) => {
        try {
            
        } catch (exception) {
            next(exception);
        }
    }

    viewOrderDetails = async (req, res, next) => {
        try {

        } catch (exception) {
            next(exception);
        }
    }   

}


const orderCtr = new OrderController();
module.exports = orderCtr;