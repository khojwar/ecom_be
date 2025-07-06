const userRouter = require('express').Router();
const { USER_ROLES } = require('../../config/constant.js');
const auth = require('../../middlewares/auth.middleware.js');
const bodyValidator = require('../../middlewares/request-validate.middleware.js');
const uploader = require('../../middlewares/uploader.middleware.js');
const userCtr = require('./user.controller.js');
const { userUpdateDTO } = require('./user.validator.js');

// User routes (we don't need to write all the routes here)
userRouter.route('/').get(auth(USER_ROLES.ADMIN), userCtr.listAllUsers);
userRouter.get("/:userId", userCtr.getUserById);


/* ASSIGNMENT done: 
* update, delete (soft delete)
* create trash user route 
* delete user from trash
*/

userRouter.put('/:userId', auth(USER_ROLES.ADMIN), uploader().single('image'), bodyValidator(userUpdateDTO), userCtr.updateUserById);
userRouter.delete("/:userId", auth(USER_ROLES.ADMIN), userCtr.softDeleteUserById);
userRouter.patch("/:userId/restore", auth(USER_ROLES.ADMIN), userCtr.restoreUser);
userRouter.delete("/:userId/permanent", auth(USER_ROLES.ADMIN), userCtr.hardDeleteUser);



module.exports = userRouter;

