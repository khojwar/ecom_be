const joi = require('joi');
const { Status } = require('../../config/constant');

const ProductCreateDTO = joi.object({
    name: joi.string().min(2).max(200).required(),
    description: joi.string().min(100).max(2000).required(),
    price: joi.number().min(100).required(),   // taking price in rupees
    category: joi.array().items(joi.string()).required(),
    discount: joi.number().max(80).allow(null,0).default(0).optional(), 
    tags: joi.array().items(joi.string()).allow(null,'').optional().default(null),
    stock: joi.number().min(0).allow(null,'').optional().default(0),
    brand: joi.string().allow(null,'').optional().default(null),
    attributes: joi.array().items({
        key: joi.string(),
        value: joi.array().items(joi.string())
    }).allow(null, '').optional().default(null), // [{ key: color, value: ['red', 'black'] }]
    sku: joi.string().allow(null, '').optional().default(null), // Stock Keeping Unit
    homeFeature: joi.boolean().default(false),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    images: joi.string().allow(null, '').default(null),
})

const ProductUpdateDTO = joi.object({
    name: joi.string().min(2).max(200).required(),
    description: joi.string().min(100).max(2000).required(),
    price: joi.number().min(100).required(),   // taking price in rupees
    category: joi.array().items(joi.string()).required(),
    discount: joi.number().max(80).allow(null,0).default(0).optional(), 
    category: joi.array().items(joi.string()).required(),
    tags: joi.array().items(joi.string()).allow(null,'').optional().default(null),
    stock: joi.number().min(0).allow(null,'').optional().default(0),
    brand: joi.string().allow(null,'').optional().default(null),
    attributes: joi.array().items({
        key: joi.string(),
        value: joi.array().items(joi.string())
    }).allow(null, '').optional().default(null), // [{ key: color, value: ['red', 'black'] }]
    sku: joi.string().allow(null, '').optional().default(null), // Stock Keeping Unit
    homeFeature: joi.boolean().default(false),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    images: joi.string().allow(null, '').default(null),
})

module.exports = {
    ProductCreateDTO,
    ProductUpdateDTO
}