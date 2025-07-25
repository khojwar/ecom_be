const mongoose = require("mongoose");
const { PAYMENT_METHODS, PAYMENT_STATUS } = require("../../../config/constant");

const transactionSchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true
    },
    transactionCode: {
        type: String,
        required: true,
        unique: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: Object.values(PAYMENT_METHODS),
        default: PAYMENT_METHODS.COD
    },
    status: {
        type: String,
        required: true,
        enum: Object.values(PAYMENT_STATUS),
        default: PAYMENT_STATUS.PENDING
    },
    amount: {
        type: Number,
        required: true,
        min: 100        // 100 paisa minimum or 1 rupee
    },
    response: String

}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})

const TransactionModel = mongoose.model("Transaction", transactionSchema);
module.exports = TransactionModel;

