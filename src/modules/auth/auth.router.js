const authRouter = require('express').Router();
const auth = require('../../middlewares/auth.middleware.js');
const bodyValidator = require('../../middlewares/request-validate.middleware.js');
const uploader = require('../../middlewares/uploader.middleware.js');
const AuthController = require("./auth.controller.js"); // import auth controller
const { RegisterDTO, LoginDTO, ForgetPasswordRequestDTO, ResetPasswordDTO, UpdateRegisterDTO } = require('./auth.validator.js');


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


// //  auth module
// const validationHandle = (schema) => {
//     return (req, res, next) => {
//         console.log("validation middleware");
        
//     }
// }

// rules = {}

//  authRouter.post("/register", validationHandle(rules), authCtrl.registerUser)

authRouter.post("/register", uploader().single("image"), bodyValidator(RegisterDTO), authCtrl.registerUser)
// authRouter.post("/activate/:token", (req, res) => {
authRouter.get("/activate/:token", authCtrl.activateUser);

authRouter.post("/login", bodyValidator(LoginDTO), authCtrl.loginUser)

// loggedIn user can only access this route
authRouter.get("/me", auth(), authCtrl.loggedInUserProfile)        // can be accessed by all logged in users
// authRouter.get("/me", auth(["admin", "seller"]), authCtrl.loggedInUserProfile)      // only admin and seller can access this route

authRouter.get("/logout", auth(), authCtrl.logoutUser)

authRouter.get("/refresh", authCtrl.refreshToken)

authRouter.post("/forget-password", bodyValidator(ForgetPasswordRequestDTO), authCtrl.forgetPasswordRequest)
authRouter.get("/forget-password-verify/:token", authCtrl.forgetPasswordVerify)
authRouter.put("/reset-password", bodyValidator(ResetPasswordDTO), authCtrl.resetPassword)


authRouter.put("/user/:id",bodyValidator(UpdateRegisterDTO), authCtrl.updateUserById)



module.exports = authRouter; // export the auth router


