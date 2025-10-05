const { PAYMENT_METHODS, PAYMENT_STATUS } = require("../../../config/constant");
const BaseService = require("../../../services/base.service.js");
const { randomStringGenerator } = require("../../../utilities/helper");
const TransactionModel = require("./transaction.model.js"); 

class TransactionService extends BaseService {
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

    async getSingleRowByFilter(filter) {
        try {
            const data = await TransactionModel.findOne(filter);
            return data;

        } catch (exception) {
            throw exception;
        }
    }

    getAllRowByFilter = async (filter, query) => {
        try {
            const page = parseInt(query.page) || 1;
            const limit = parseInt(query.limit) || 10;
            const skip = (page-1) * limit;

            const data = await TransactionModel.find(filter)
            .populate("order", ['_id', 'code', 'subTotal', 'total', 'status', 'isPaid'])
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

            const count = await TransactionModel.countDocuments(filter);

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

    listAllTransaction = async (query, filter) => {
        try {
            return await this.getAllRowByFilter(filter, query);
        } catch (exception) {
            throw exception;
        }
    }


}

const transactionSvc = new TransactionService();
module.exports = transactionSvc;