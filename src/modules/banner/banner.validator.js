const joi = require('joi');
const { Status } = require('../../config/constant');

const BannerCreateDTO = joi.object({
    title: joi.string().min(2).max(50).required(),
    link: joi.string().uri().allow(null, '').default(null),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    image: joi.string().allow(null, '').default(null),
})

const BannerUpdateDTO = joi.object({
    title: joi.string().min(2).max(50).required(),
    link: joi.string().uri().allow(null, '').default(null),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    image: joi.string().allow(null, '').default(null),
})

module.exports = {
    BannerCreateDTO,
    BannerUpdateDTO
}