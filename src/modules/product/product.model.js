const mongoose = require("mongoose");
const { Status } = require("../../config/constant");

// id, title, slug, description, price, discount, afterDiscount, category, tag, stock, seller, brand, attribute, image, sku, status, createdBy, updatedBy, createdAt, updatedAt
const productSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        min: 2,
        max: 200,
    },
    slug: {
        type: String,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,       // Price in cents or smallest currency unit or paisa
        required: true,
        min: 10000,         // Minimum price of Rs. 100.00
    },
    discount: {             // in percentage
        type: Number,      
        min: 0,
        max: 80,
    },
    afterDiscount: {
        type: Number,  
        required: true,
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    tags: [String], // Array of tags
    stock: {
        type: Number,
        min: 0,
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brand',
        default: null,
    },
    // attribute store format: [{ key: color, value: ['red', 'black'] }]
    // display as color: red, black
    attributes: [{
        key: String,
        value: [String]
    }],
    images: [{
        publicId: String,
        secureUrl: String,
        optimizedUrl: String,
    }],
    // store keeping unit   --> it is for inventory management, unique identifier for each product, usually in the format of SKU12345
    sku: String,
    homeFeature: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.INACTIVE,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
  },
  {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
