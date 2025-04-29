const userRouter = require('express').Router();
const UserController = require('./user.controller.js');

const userCtr = new UserController();

userRouter.post("/create", userCtr.createUser); 
userRouter.put("/update/:id", userCtr.updateUser);
userRouter.get("/list", userCtr.listAllUsers);
userRouter.get("/view/:id", userCtr.viewUserDetails);
userRouter.delete("/delete/:id", userCtr.deleteUser);


module.exports = userRouter;

