const joi = require('joi');

const AddToCartDTO = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().min(1).max(5).required()
});

const DeleteFromCartDTO = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().min(0).optional()
});

module.exports = {
    AddToCartDTO,
    DeleteFromCartDTO
};
