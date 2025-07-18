const { message } = require("laravel-mix/src/Log");
const orderDetailService = require("./order-detail.service");
const productSvc = require("../../product/product.service");
const Log = require("laravel-mix/src/Log");

class OrderDetailController {
    addToCart = async (req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;
            const {productId, quantity} = req.body;            

            const productDetail = await productSvc.getSingleRowByFilter({ _id: productId});

            if (!productDetail) {
                throw {
                    message: "Product not found",
                    status: "PRODUCT_NOT_FOUND",
                    code: 422
                }
            }

            // Check if the product is already in the cart
            const cartFilter = {
                product: productDetail._id,
                buyer: loggedInUser._id,
                order: null     // Ensure it's a cart item (not part of an order)
            }
            
            const existingCart = await orderDetailService.getSingleRowByFilter(cartFilter);

            let currentCart = null;

            if (existingCart) {
                // If the product is already in the cart, update the quantity
                if (productDetail.stock < existingCart.quantity + quantity) {
                    throw {
                        message: "Insufficient stock",
                        status: "INSUFFICIENT_STOCK",
                        code: 422
                    }
                }

                existingCart.quantity += quantity;
                existingCart.price = productDetail.afterDiscount;
                existingCart.subTotal = existingCart.price * existingCart.quantity;
                existingCart.total = existingCart.subTotal + existingCart.deliveryCharge;
                currentCart = await existingCart.save();

            } else {
                if (productDetail.stock < quantity) {
                    throw {
                        message: "Insufficient stock",
                        status: "INSUFFICIENT_STOCK",
                        code: 422
                    }
                }

                // Transform the product detail and quantity into a cart item
                const cartItem = await orderDetailService.transformToCartItem({
                    productDetail,
                    quantity,
                    loggedInUser
                });

                // Create a new cart item
                const currentCart = await orderDetailService.addToCart(cartItem);  
            }

            res.json({
                data: currentCart,
                message: "Item added to cart",
                status: "ITEM_ADDED",
                options: null
            });


        } catch (exception) {
            console.log("Error in addToCart: ", exception);
            next(exception); 
        }
    }

    viewMyCart = async (req, res, next) => {
        try {
            const loggedInUser = req.loggedInUser;
            
            // Filter to get the cart items for the logged-in user
            // where order is null (indicating it's a cart item)
            const cartFilter = {
                order: {$eq: null}, 
                buyer: loggedInUser._id,
            }

            const {data, pagination} = await orderDetailService.getAllRowsByFilter(cartFilter, req.query);

            res.json({
                data: data,
                message: "Your cart details",
                status: "CART_VIEWED",
                options: {
                    pagination: pagination,
                }
            })

        } catch (exception) {
            next(exception);
        }
    }

    deleteFromCart = async (req, res, next) => {
        try {
            
        } catch (exception) {
            next(exception);
        }
    }
    
}
const orderDetailController = new OrderDetailController();
module.exports = orderDetailController;