const joi = require('joi');
const { Status } = require('../../config/constant');

const BrandCreateDTO = joi.object({
    name: joi.string().min(2).max(50).required(),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    logo: joi.string().allow(null, '').default(null),
})

module.exports = {
    BrandCreateDTO
}