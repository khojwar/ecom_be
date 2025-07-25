const { PAYMENT_METHODS, PAYMENT_STATUS } = require("../../../config/constant");
const { randomStringGenerator } = require("../../../utilities/helper");
const TransactionModel = require("./transaction.model.js"); 

class TransactionService {
    transformToTransactionObject = (order) => {
        return {
            order: order._id,
            transactionCode: randomStringGenerator(15),
            paymentMethod: PAYMENT_METHODS.COD,
            status: PAYMENT_STATUS.PENDING,
            amount: order.total,
            response: null
        };
    }

    createTransaction = async (transactionData) => {
        try {
            const transaction = new TransactionModel(transactionData);
            return await transaction.save();
        } catch (exception) {
            throw exception;
        }
    }
}

const transactionSvc = new TransactionService();
module.exports = transactionSvc;