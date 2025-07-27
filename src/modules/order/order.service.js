const OrderModel = require("./order.model");
const {randomStringGenerator} = require('../../utilities/helper');
const { ORDER_STATUS } = require("../../config/constant");


class OrderService {

    transformToOrder = (calculationValues, loggedInUser) => {
        return {
                code: randomStringGenerator(15),
                buyer: loggedInUser._id,
                ...calculationValues,
                Status: ORDER_STATUS.PENDING,
                isPaid: false,
                createdBy: loggedInUser._id
        }
    }

    calculateValues = (cartInfo, appliedVoucherDetails) => {
        let calculationValues = {
            grossTotal: 0,
            discount: 0,
            deliveryCharge: 0,
            serviceCharge: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
        }

        cartInfo.map((cartItem) => {
            calculationValues.grossTotal += cartItem.product.afterDiscount * cartItem.quantity;
            calculationValues.deliveryCharge += cartItem.deliveryCharge || 0;
        });

        calculationValues.discount = appliedVoucherDetails ? (appliedVoucherDetails.grossTotal * appliedVoucherDetails.discount / 100) : 0;
        calculationValues.serviceCharge = (calculationValues.grossTotal - calculationValues.discount ) * (10/100)
        calculationValues.subTotal = (calculationValues.grossTotal - calculationValues.discount + calculationValues.deliveryCharge + calculationValues.serviceCharge);
        calculationValues.tax = (calculationValues.subTotal * 13 / 100);
        calculationValues.total = calculationValues.subTotal + calculationValues.tax;

        return calculationValues;
    }

    createOrder = async (orderDetail) => {
        try {
            const order = new OrderModel(orderDetail);
            return await order.save();
        } catch (exception) {
            throw exception;
            
        }
    }

    getSingleRowByFilter = async (filter) => {
        try {
            const orderDetail = await OrderModel.findOne(filter)
                .populate("buyer", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status']);
            return orderDetail;
            
        } catch (exception) {
            throw exception;
        }
    }

    getAllRowsByFilter = async (filter, query={}) => {
        try {

            const page = query.page || 1;
            const limit = query.limit || 20;
            const skip = (page - 1) * limit;

            const orders = await OrderModel.find(filter)
                            .populate("buyer", ['_id', 'name', 'email', 'address', 'phone', 'image', 'role', 'status'])
                            .sort({createdAt: -1})
                            .skip(skip)
                            .limit(limit);
            
            const totalCount = await OrderModel.countDocuments(filter);

            return {
                data: orders,
                pagination: {
                    currrentPage: parseInt(page),
                    limit: parseInt(limit),
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / limit)
                }
            };

        } catch (exception) {
            throw exception;
            
        }
    }


}







const OrderSvc = new OrderService();

module.exports = OrderSvc;
