const { ORDER_STATUS } = require('../../../config/constant');
const OrderDetailModel = require('./order-detail.model.js');


class OrderDetailService {
    getSingleRowByFilter = async (filter) => {
        try {
            // console.log("Filter in getSingleRowByFilter: ", filter);
            
            const detail = await OrderDetailModel.findOne(filter);
            return detail;
            
        } catch (exception) {
            throw exception;   
        }
    }

    getAllRowsByFilter = async (filter, query) => {
        try {
            // Pagination logic
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page - 1) * limit;
            
            
            const data = await OrderDetailModel.find(filter)
                .populate("order", ['_id', 'code', 'subTotal', 'total', 'status', 'isPaid'])
                .populate("buyer", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status'])
                .populate("seller", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status'])
                .populate("product", ['_id', 'name', 'slug', 'price', 'discount', 'afterDiscount', 'category', 'brand', 'seller', 'status'])
                .populate("createdBy", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status'])
                .populate("updatedBy", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status'])
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });       // Sort by createdAt in descending order

            // Count total documents matching the filter
            // This is used for pagination
            const count = await OrderDetailModel.countDocuments(filter);

            return {
                data,
                pagination: {
                    page: page,
                    limit: limit,
                    total: count,
                }
            }
        } catch (exception) {
            throw exception; 
        }
    }

    // Transform the product detail and quantity into a cart item
    transformToCartItem = ({productDetail, quantity, loggedInUser}) => {
        const cartItem = {
            order: null, // This will be set when the order is created
            buyer: loggedInUser._id,
            product: productDetail._id,
            quantity: quantity,
            price: productDetail.afterDiscount,
            deliveryFee: 7000, // Default delivery fee in paisa
            subTotal: productDetail.afterDiscount * quantity,
            totalPrice: (productDetail.afterDiscount * quantity) + 7000, // Including delivery fee
            status: ORDER_STATUS.PENDING,
            seller: productDetail.seller,
            createdBy: loggedInUser._id,
        };

        return cartItem;
    }

    addToCart = async (data) => {
        try {
            const orderDetailObj = new OrderDetailModel(data);
            return await orderDetailObj.save();
        } catch (exception) {
            throw exception;
        }
    }

    removeFromCartByFilter = async (filter) => {
        try {
            return await OrderDetailModel.deleteMany(filter);
        } catch (exception) {
            throw exception;
        }
    }

    convertToOrder = async (order, cartInfo) => {
        try {
            const updateInfo = [];

            cartInfo.map((cartItem) => {
                cartItem.order = order._id;
                cartItem.price = cartItem.product.afterDiscount;
                cartItem.subTotal = cartItem.product.afterDiscount * cartItem.quantity;
                cartItem.total = cartItem.subTotal + cartItem.deliveryCharge;
                cartItem.status = ORDER_STATUS.CONFIRMED;

                updateInfo.push(cartItem.save());
            })

            const statusUpdate = await Promise.allSettled(updateInfo);

            let returnOrderDetail = [];
            statusUpdate.forEach((cartItem) => {
                if (cartItem.status === 'fulfilled') {
                    returnOrderDetail.push(cartItem.value);
                }
            })

            return returnOrderDetail;

        } catch (exception) {
            throw exception;
            
        }
    }


    reduceStock = async (orderDetail) => {
        try {
            let products = [];

            orderDetail.forEach((detail) => {
                detail.product.stock -= detail.quantity;
                products.push(detail.product.save());
            })

            const response = await Promise.allSettled(products);
            const data = [];
            response.forEach((productRes) => {
                if (productRes.status === 'fulfilled') {
                    data.push(productRes.value);
                }
            });

            return data;
            
        } catch (exception) {
            throw exception;
            
        }
    }
}



const orderDetailSvc = new OrderDetailService();
module.exports = orderDetailSvc;