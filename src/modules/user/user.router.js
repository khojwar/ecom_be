const userRouter = require('express').Router();
const { USER_ROLES } = require('../../config/constant.js');
const auth = require('../../middlewares/auth.middleware.js');
const userCtr = require('./user.controller.js');

// User routes (we don't need to write all the routes here)
userRouter.route('/').get(auth(USER_ROLES.ADMIN), userCtr.listAllUsers);
userRouter.get("/:userId", userCtr.getUserById);
    



module.exports = userRouter;

