const joi = require('joi');

// DTO --> Data Transfer Object
const RegisterDTO = joi.object({
    name: joi.string().required().min(3).max(50),
    // .messages({
    //     "string.empty": "Name is required",
    //     "string.min": "Name must be at least 3 characters long",
    //     "string.max": "Name must be at most 50 characters long",
    // }),
    email: joi.string().email().required(),
    password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[!@#$%^&*()_])[a-zA-Z\d!@#$%^&*()_]{8,25}$/).required(),    // TODO: Regex defined (min 1 small, 1 capital, 1 number, 1 special char, min 8 char and max 25 char)
    confirmPassword: joi.string().required().valid(joi.ref("password")).messages({
        'any.only': 'Password and confirmPassword must be same'
    }),    
    phone: joi.string().regex(/^(?:\+977[- ]?)?(?:\d{1,3}[- ]?)?\d{6,10}$/).optional().allow("", null).default(null),
    address: joi.object({
        billingAddress: joi.string().max(100).allow("", null).default(null),
        shippingAddress: joi.string().max(100).allow("", null).default(null),
    }).allow("", null).default(null),
    role: joi.string().regex(/^(customer|seller|admin)$/).default('customer'),
    // gender: joi.string.allow('male', 'female', 'other').optional().default('null'),
    gender: joi.string().regex(/^(male|female|other)$/).optional().default('null'),
    image: joi.string().optional().allow("", null).default(null),
})



module.exports = {
    RegisterDTO,
}