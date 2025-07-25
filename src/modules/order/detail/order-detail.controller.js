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

            // console.log("Existing Cart: ", existingCart);
            

            let currentCart = null;

            if (existingCart) {

                // If the product is already in the cart, update the quantity
                existingCart.quantity = existingCart.quantity + quantity;

                if (productDetail.stock < existingCart.quantity) {
                    throw {
                        message: "Insufficient stock",
                        status: "INSUFFICIENT_STOCK",
                        code: 422
                    }
                }

                existingCart.price = productDetail.afterDiscount;
                existingCart.subTotal = existingCart.price * existingCart.quantity;
                existingCart.total = existingCart.subTotal + existingCart.deliveryCharge;
                currentCart = await existingCart.save();

            } else {
                // if the product is not in the cart, check stock availability and add to cart
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
                currentCart = await orderDetailService.addToCart(cartItem);  
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
            const loggedInUser = req.loggedInUser;
            const {productId, quantity} = req.body;  
            
            // console.log("Product ID: ", productId, " Quantity: ", quantity);

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
                product: productId,
                buyer: loggedInUser._id,
                order: {$eq: null}     // Ensure it's a cart item (not part of an order)
            }
            
            const existingCart = await orderDetailService.getSingleRowByFilter(cartFilter);

            if (!existingCart) {
                throw {
                    message: "Cart does not exist",
                    status: "CART_NOT_FOUND_ERROR",
                    code: 422
                }
            }

            let currentCart = null;

            // If the product is in the cart, check if the quantity to remove is valid
            if (existingCart.quantity < quantity) {
                throw {
                    message: "Quantity exceeds than existing cart quantity",
                    status: "QUANTITY_TO_REMOVE_EXCEEDS",
                    code: 422
                }
            } else if (existingCart.quantity === quantity || quantity === 0) {
                // If the quantity to remove is equal to the cart quantity, delete the cart item
                await orderDetailService.removeFromCartByFilter({
                    _id: existingCart._id,           
                });
            } else {
                existingCart.quantity = existingCart.quantity - quantity;
                existingCart.price = productDetail.afterDiscount;
                existingCart.subTotal = existingCart.price * existingCart.quantity;
                existingCart.total = existingCart.subTotal + existingCart.deliveryCharge;

                currentCart = await existingCart.save();
            }

            res.json({
                data: currentCart,
                message: "Cart item updated successfully",
                status: "CART_ITEM_UPDATED",
                options: null
            });


        } catch (exception) {
            // console.log("Error in addToCart: ", exception);
            next(exception); 
        }
    }
    
}
const orderDetailController = new OrderDetailController();
module.exports = orderDetailController;