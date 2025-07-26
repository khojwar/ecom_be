const orderDetailSvc = require("./detail/order-detail.service");
const OrderSvc = require("./order.service");
const transactionSvc = require("./transaction/transaction.service");
const orderNotificationSvc = require("./order.mail");
const axios = require('axios');
const { PaymentConfig, AppConfig } = require("../../config/config");


class OrderController {
    checkout = async (req, res, next) => {
        try {
           
            let { cartId, applyVoucher} = req.body;
            const loggedInUser = req.loggedInUser;

            let newCartId = [];

            // remove duplicates from cartId
            (new Set(cartId)).forEach((val) => {
                newCartId.push(val);
            });            


            // Fetch cart items for the logged-in user
            const {data: cartInfo} = await orderDetailSvc.getAllRowsByFilter({
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
            
            // console.log("cartInfo", cartInfo);     // solved till now
            

            // Check if the cart items are already in an order 
            let exists = [];
            let stockCheck = {};   

            cartInfo.forEach((cartItem) => {
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
            await orderDetailSvc.convertToOrder(order, cartInfo);

            // stock reduce
            await orderDetailSvc.reduceStock(cartInfo);

            // Create a transaction
            let transaction =  transactionSvc.transformToTransactionObject(order);
            await transactionSvc.createTransaction(transaction);

            // Send notifications
            await orderNotificationSvc.sendOrderDetailNotification(order, cartInfo);

            res.json({
                data: order,
                message: "Your order has been placed successfully.",
                status: "ORDER_PLACED_SUCCESS",
                options: null
            })


        } catch (exception) {
            // console.log("Error in checkout:", exception);
            
            next(exception);  
        }
    }

    initiatePayment  = async (req, res, next) => {
        try {
            const orderCode = req.params.orderCode;
            const buyer = req.loggedInUser;

            const orderDetail = await OrderSvc.getSingleRowByFilter({
                code: orderCode,
                buyer: buyer._id
            })

            if (!orderDetail) {
                throw {
                    code: 422,
                    message: "Order not found.",
                    status: "ORDER_NOT_FOUND_ERROR"
                }
            }

            // paymentUrl

            //----------- BY USING AXIOS TO CALL KHALTI API -------------
            // const paymentResponse = await axios.post(PaymentConfig.khalti.url, 
            //     JSON.stringify(                {
            //         "return_url": AppConfig.frontendUrl + "/payment?success=true",
            //         "website_url": AppConfig.frontendUrl,
            //         "amount": orderDetail.total,
            //         "purchase_order_id": orderDetail.code,
            //         "purchase_order_name": "E-Payment Purchase",
            //     }), {
            //         headers: {
            //             "Content-Type": "application/json",
            //             "Authorization": `Key ${PaymentConfig.khalti.secretKey}`
            //         }
            //     }

            // );

            // console.log("Payment Response: ", paymentResponse.data);

            // ----------- BY USING fETCH TO CALL KHALTI API -------------
            const paymentResponse = await fetch(PaymentConfig.khalti.url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Key ${PaymentConfig.khalti.secretKey}`
                },
                body: JSON.stringify({
                    "return_url": AppConfig.frontendUrl + "/payment?success=true",
                    "website_url": AppConfig.frontendUrl,
                    "amount": orderDetail.total,
                    "purchase_order_id": orderDetail.code,
                    "purchase_order_name": "E-Payment Purchase",
                })
            });


            res.json({
                data: await paymentResponse.json(),
                message: "Payment initiated successfully.",
                status: "PAYMENT_INITIATED",
                options: null
            })

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