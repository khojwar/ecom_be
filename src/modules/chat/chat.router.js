const chatCtrl = require('./chat.controller');
const { ChatDataDTO } = require('./chat.validator');
const bodyValidator = require('../../middlewares/request-validate.middleware');
const auth = require("../../middlewares/auth.middleware.js");

const chatRouter = require('express').Router();

chatRouter.post("/sendMessage", auth(), bodyValidator(ChatDataDTO), chatCtrl.storeChat);
chatRouter.get("/:receiver", auth(), chatCtrl.getAllChats);

module.exports = chatRouter;