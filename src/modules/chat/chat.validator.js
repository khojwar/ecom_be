const Joi = require("joi");

const ChatDataDTO = Joi.object({
    receiver: Joi.string().required(),
    message: Joi.string().min(1).max(2000).required(),
})

module.exports = {
    ChatDataDTO
}