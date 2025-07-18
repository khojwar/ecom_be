const joi = require("joi");

const CheckoutDTO = joi.object({
    cartId: joi.array().items(joi.string()).required(),
    applyVoucher: joi.string().allow(null, '').default(null).optional(),
});

module.exports = {
    CheckoutDTO,
};