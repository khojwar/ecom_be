const joi = require('joi');
const { Status } = require('../../config/constant');

const CategoryCreateDTO = joi.object({
    name: joi.string().min(2).max(50).required(),
    parentId: joi.string().allow(null, '').optional().default(null),
    brands: joi.array().items(joi.string().allow(null, '').optional().default(null)).allow(null).optional().default(null),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    icon: joi.string().allow(null, '').default(null),
    showInMenu: joi.boolean().default(false),
    homeFeature: joi.boolean().default(false),
})

const CategoryUpdateDTO = joi.object({
    name: joi.string().min(2).max(50).required(),
    parentId: joi.string().allow(null, '').optional().default(null),
    brands: joi.array().items(joi.string().allow(null, '').optional().default(null)).allow(null).optional().default(null),
    status: joi.string().regex(/^(active|inactive)$/i).default(Status.INACTIVE),
    icon: joi.string().allow(null, '').default(null),
})

module.exports = {
    CategoryCreateDTO,
    CategoryUpdateDTO
}