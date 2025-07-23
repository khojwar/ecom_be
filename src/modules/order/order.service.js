const OrderModel = require("./order.model");
const {randomStringGenerator} = require('../../utilities/helper')


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


}

const OrderSvc = new OrderService();

module.exports = OrderSvc;
