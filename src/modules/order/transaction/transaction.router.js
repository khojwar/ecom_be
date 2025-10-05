const { USER_ROLES } = require("../../../config/constant");
const auth = require("../../../middlewares/auth.middleware");
const transactionCtr = require("./transaction.controller");

const transactionRouter = require("express").Router();

transactionRouter.get('/', auth(USER_ROLES.ADMIN, USER_ROLES.CUSTOMER), transactionCtr.listAllTransaction);


module.exports = transactionRouter;