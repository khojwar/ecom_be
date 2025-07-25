const mongoose = require("mongoose");
const { ORDER_STATUS } = require("../../config/constant");

// id, code, buyer, grossTotal, discount, deliveryCharge, serviceCharge, subTotal, tax, total, status, isPaid, createdBy, updatedBy, createdAt, updatedAt
const orderSchema = new mongoose.Schema(
  {
    code: {
        type: String,
        min: 10,
        max: 20,
        required: true,
        unique: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    grossTotal: {
        type: Number,
        default: 0,
    },
    discount: {             // in percentage
        type: Number,      
        min: 0,
        max: 80,
    },
    deliveryCharge: {
        type: Number,  
        default: 0,
    },
    serviceCharge: {
        type: Number,  
        default: 0,
    },
    subTotal: {
        type: Number, 
        default: 0, 
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
        required: true,
    },
    status: {
        type: String,
        enum: Object.values(ORDER_STATUS),
        default: ORDER_STATUS.PENDING,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const OrderModel = mongoose.model("Order", orderSchema);
module.exports = OrderModel;
