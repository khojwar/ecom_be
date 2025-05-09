const authRouter = require('express').Router();
const AuthController = require("./auth.controller.js"); // import auth controller


const authCtrl = new AuthController(); // create an instance of auth controller

// ------------- Auth module -----------------------

/**
 * Task:
 * Build atleast the following routes:
 ** Auth and authentication
 * - register
 * - activate
 * - login done
 * - forget password request
 * - token verify for forget password
 * - password reset router
 * - password User get profile
 * - logout
 * - user update
 * 
 */


 authRouter.post("/register", authCtrl.registerUser)

 // authRouter.post("/activate/:token", (req, res) => {
authRouter.get("/activate/:token", authCtrl.activateUser);
authRouter.post("/login", authCtrl.loginUser)
authRouter.post("/forget-password", authCtrl.forgetPasswordRequest)
authRouter.get("/forget-password-verify/:token", authCtrl.forgetPasswordVerify)
authRouter.put("/reset-password", authCtrl.resetPassword)

// loggedIn user can only access this route
authRouter.get("/me", authCtrl.loggedInUserProfile)

authRouter.get("/logout", authCtrl.logutUser)
authRouter.put("/user/:id", authCtrl.updateUserById)



module.exports = authRouter; // export the auth router


