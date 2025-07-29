const orderDetailSvc = require("./detail/order-detail.service");
const OrderSvc = require("./order.service");
const transactionSvc = require("./transaction/transaction.service");
const orderNotificationSvc = require("./order.mail");
const axios = require('axios');
const { PaymentConfig, AppConfig } = require("../../config/config");
const { PAYMENT_STATUS, PAYMENT_METHODS, USER_ROLES, ORDER_STATUS } = require("../../config/constant");
const { data } = require("autoprefixer");
const { message } = require("laravel-mix/src/Log");


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
            const response = await fetch(
                PaymentConfig.khalti.url + "epayment/initiate/",
                {
                method: "POST",
                body: JSON.stringify({
                    return_url: AppConfig.frontendUrl + "/payment?success=true",
                    website_url: AppConfig.frontendUrl,
                    amount: 1000, //in paisa, less than 2 lakh
                    purchase_order_id: orderDetail.code,
                    purchase_order_name: "E-payment purchase",
                    /*  customer_info: {
                    name: orderDetail.buyer?.name,
                    email: orderDetail.buyer?.email,
                    phone: String(orderDetail.buyer?.phone),
                },
                amount_breakdown: [
                    {
                    label: "Mark Price",
                    amount: orderDetail.subTotal,
                    },
                    {
                    label: "VAT",
                    amount: orderDetail.tax,
                    },
                ], */
                    /*  product_details: [
                    {
                    identity: "1234567890",
                    name: "Khalti logo",
                    total_price: 1300,
                    quantity: 1,
                    unit_price: 1300,
                    },
                ], */
                    //   merchant_username: "merchant_name",
                    //   merchant_extra: "merchant_extra",
                }),

                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Key " + PaymentConfig.khalti.secretKey,
                },
                }
            );
            const paymentResponse = await response.json();

            res.json({
                data: paymentResponse,
                message: "Payment Initiated",
                status: "PAYMENT_INITIATED",
                options: null,
            });

        } catch (exception) {
            console.log("Error in initiatePayment:", exception);
            next(exception);
        }
    }

    updatePaymentDetails = async (req, res, next) => {
        try {

            const paymentResponse = req.body;
            const orderCode = req.params.orderCode;

            const orderDetail = await OrderSvc.getSingleRowByFilter({
                code: orderCode,
            })

            if (!orderDetail) {
                throw {
                    code: 422,      // 422 for Unprocessable Entity
                    message: "Order not found.",
                    status: "ORDER_NOT_FOUND_ERROR"
                }
            }

            orderDetail.isPaid = true;
            await orderDetail.save();

            const transaction = await transactionSvc.getSingleRowByFilter({
                order: orderDetail._id
            })

            transaction.amount = paymentResponse.total_amount;
            transaction.transactionCode = paymentResponse.transaction_id;
            transaction.paymentResponse = JSON.stringify(paymentResponse);
            transaction.status = PAYMENT_STATUS.PAID;
            transaction.paymentMethod = PAYMENT_METHODS.KHALTI;

            await transaction.save();

            res.json({
                data: null,
                message: "Payment has been updated successfully.",
                status: "PAYMENT_DONE",
                options: null
            })

        } catch (exception) {
            next(exception);
        }
    }

    listAllOrders = async (req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;

            if (loggedInUser.role === USER_ROLES.CUSTOMER || loggedInUser.role === USER_ROLES.ADMIN) {
                // if customer or admin, query order
                let filter={}

                if (loggedInUser.role === USER_ROLES.CUSTOMER) {
                    filter = { buyer: loggedInUser._id };
                }

                // search
                if (req.query.search) {
                    filter = {
                        ...filter,
                        $or: [
                            { code: new RegExp(req.query.search, 'i') },
                        ]
                    };
                }

                // status
                if (req.query.status) {
                    filter = {
                        ...filter,
                        Status: req.query.status
                    };
                }

                // paid
                if (req.query.paid) {
                    filter = {
                        ...filter,
                        isPaid: isPaid === 'true' ? true : false
                    };
                }

                // pagination
                const {data, pagination} = await OrderSvc.getAllRowsByFilter(filter, req.query);

                res.json({
                    data,
                    message: "Orders fetched successfully.",
                    status: "ORDERS_FETCHED",
                    options: {
                        pagination
                    }
                });

            } else {
                // if seller, query orderDetail

                const filter = {
                    seller: loggedInUser._id,
                    order: {$ne: null},
                    status: {$ne: ORDER_STATUS.PENDING}
                };

                const {data, pagination} = await orderDetailSvc.getAllRowsByFilter(filter, req.query);

                res.json({
                    data,
                    message: "Orders fetched successfully.",
                    status: "ORDERS_FETCHED",
                    options: {
                        pagination
                    }
                });

            }

        } catch (exception) {
            next(exception);
        }
    }

    viewOrderDetails = async (req, res, next) => {
        try {

            const { orderCode } = req.params;
            const loggedInUser = req.loggedInUser;

            const order = await OrderSvc.getSingleRowByFilter({ code: orderCode });

            if (!order) {
                throw {
                    message: 'Order not found',
                    status: 'ORDER_NOT_FOUND_ERR',
                    code: 422
                }
            }

            let filter = {
                order: order._id,
                // status: { $ne: ORDER_STATUS.PENDING },
            }

            if (loggedInUser.role === USER_ROLES.CUSTOMER) {
                filter = {
                    ...filter,
                    buyer: loggedInUser._id,
                }
            }

            const {data, pagination} = await orderDetailSvc.getAllRowsByFilter(filter, req.query);

            res.json({
                data,
                message: "Orders Details fetched successfully.",
                status: "YOUR_ORDER_DETAILS_FETCHED",
                options: {
                    pagination
                }
            });
            
        } catch (exception) {
            next(exception);
        }
    }   

}


const orderCtr = new OrderController();
module.exports = orderCtr;