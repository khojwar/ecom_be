
const { AppConfig } = require('../../config/config');
const userSvc = require('../user/user.service');
const authServ = require('./auth.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomStringGenerator } = require('../../utilities/helper');


class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = await authServ.transformUserCreate(req);

      // insert data into db
      let user = await userSvc.createUser(data);

      // Email
      // Queue (bull or rabbitmq)
      // bg process
      // trigger
      req.myEvent.emit("sendWelcomeNotification", user);

      // await authServ.sendActivationNotification(user);

      res.status(200).json({
        data: userSvc.getUserPublicProfile(user),
        message:
          "Thank you for registering, You have received an email for activation process. Please follow the email",
        status: "Success",
        options: null,
      });
    } catch (exception) {
      next(exception);
    }
  };

  activateUser = async (req, res, next) => {
    try {
            const token = req.params.token;  // OR  const {token} = req.params; 
        
            // let params = req.params;
            // const header = req.headers;
            // const query = req.query;

            // fetch user data from db by token
            const userDetail = await userSvc.getSingleUserByFilter({
                activationToken: token,
            })

            if (!userDetail) {
                throw {
                    status: 404,
                    message: "User associated with token not found or has been already activated...",
                    status: "NOT_FOUND",
                }
            }

            // update user status to active
            const updatedUser = await userSvc.updateSingleUserByFilter({
                _id: userDetail._id,
            }, {
                status: "ACTIVE",
                activationToken: null,
            });

            await authServ.newUserWelcomeEmail(updatedUser)

            res.json({
                data: null,
                message: "Your account has been activated successfully. Please login to continue ... ",
                status: "ACTIVATED",
                options: null,
            })

    } catch (exception) {
            console.log("Activation Error", exception);
            next(exception);
    }

  };


  loginUser = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const userDetail = await userSvc.getSingleUserByFilter({
        email
      })

      if (!userDetail) {
        throw {
          status: 422,
          message: "Email not registered yet",
          status: "EMAIL_NOT_REGISTERED",
        }
      }

      // check password and is user is activated
      if (!bcrypt.compareSync(password, userDetail.password)) {
        throw {
          status: 422,
          message: "Credentials do not match",
          status: "CREDENTIALS_DO_NOT_MATCH",
        }
      }

      if (userDetail.status !== "ACTIVE" || userDetail.activationToken !== null) {
        throw {
          status: 422,
          message: "User is not activated yet",
          status: "USER_NOT_ACTIVATED",
        }
      }

      // TODO: for 2FA 
      // ----------- steps-----------:
      // generate otp and send sms/email
      // save otp in db
      // check if otp is valid
      // if valid, then generate jwt token and send to user


      // ******* FOR: single user, single login ************
      // const allAuthData = await authServ.getAllRowByFilter({
      //   user: userDetail._id,
      // })

      // if (allAuthData.length > 0) {
      //   throw {
      //     code: 403,
      //     message: "Logout from other devices first",
      //     status: "LOGOUT_FROM_ALL_DEVICES",
      //   }
      // }




      // ----------- generate jwt token -----------
     // 1. access token  and  2. refresh token

     const accessToken = jwt.sign({
      sub: userDetail._id,
      typ: "Bearer",
     }, AppConfig.jwtSecret, {
      expiresIn: "1h",
     })

      const refreshToken = jwt.sign({
       sub: userDetail._id,
       typ: "refresh",
      }, AppConfig.jwtSecret, {
       expiresIn: "1d",
      })

      const maskedAccessToken = randomStringGenerator(150);
      const maskedRefreshToken = randomStringGenerator(150);

      const authData = {
        user: userDetail._id,
        accessToken,
        refreshToken,
        maskedAccessToken,
        maskedRefreshToken,
      }

      await authServ.createAuthData(authData);


      res.json({
        data: {
          accessToken: maskedAccessToken,
          refreshToken: maskedRefreshToken,
        },
        message: "You are loggedIn",
        status: "LOGGED_IN_SUCCESS",
        options: null,
      })


    } catch (exception) {
      next(exception);
      
    }
  };

  // ----------------------------------------
  // steps:
  // 1. forget password request + send email with token
  // 2. verify token
  // 3. reset password



  forgetPasswordRequest = async (req, res, next) => {
    try {
      const { email } = req.body;

      const userDetail = await userSvc.getSingleUserByFilter({
        email,
      })

      if (!userDetail) {
        throw {
          code: 400,
          detail: {
            email: "User not registered yet",
          },
          message: "User not registered yet",
          status: "USER_NOT_FOUND",
        }
      }

      // request for forget password using email or phone number 

      const forgetData = {
        forgetPasswordToken: randomStringGenerator(150),
        expiryTime: new Date(Date.now() + 3*60 * 60 * 1000), // 3 hours from now
      }

      const updatedUser = await userSvc.updateSingleUserByFilter({
        _id: userDetail._id,
      }, forgetData)

      await authServ.sendPasswordResetRequestEmail(updatedUser);
      
      res.json({
        data: null,
        message: "Forget password request has been sent successfully. Please check your email for further instructions.",
        status: "FORGET_PASSWORD_REQUESTED",
        options: null,
      })


    } catch (exception) {
      next(exception);
      
    }
  };

  forgetPasswordTokenVerify = async (req, res, next) => {
    try {
      let token = req.params.token;  // OR  const {token} = req.params; 

      const userDetail = await authServ.verifyPasswordResetToken(token);

      res.json({
        data: token,
        message: "Token verified successfully",
        status: "SUCCESS",
        options: null,
      })
      


    } catch (exception) {
      next(exception);
      
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      
      let token = req.headers.authorization;
      token = token.replace("Bearer ", "");

      const userDetail = await authServ.verifyPasswordResetToken(token);
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);

      await userSvc.updateSingleUserByFilter({
        _id: userDetail._id,
      }, {
        password: hashedPassword,
        forgetPasswordToken: null,
        expiryTime: null,
      });

      // logout user from all devices
      await authServ.logoutFromAllDevices({
        user: userDetail._id,
      })

      // send email notification
      await authServ.sendPasswordResetSuccessEmail(userDetail);

      res.json({
        data: null,
        message: "Password reset successfully",
        status: "PASSWORD_RESET_SUCCESS",
        options: null,
      });

    } catch (exception) {
      next(exception);

    }
  };

  // ----------------------------------

  loggedInUserProfile = (req, res, next) => {
    res.status(200).json({
      data: req.loggedInUser,
      message: "Me route",
      status: "Success",
      options: null,
    });
  };

  logoutUser = async (req, res, next) => {
    try {
      await authServ.logoutUser(req.headers['authorization']);
      res.json({
        data: null,
        message: "You are logged out successfully",
        status: "LOGGED_OUT_SUCCESS",
        options: null,
      })
      
      res.json({
        data: null,
        message: "You are logged out successfully",
        status: "LOGGED_OUT_SUCCESS",
        options: null,
      })

    } catch (exception) {
      next(exception);
      
    }
  };

  updateUserById = (req, res, next) => {
    try {
      let userId = req.params.id;

      // TODO:
      
      
    } catch (exception) {
      next(exception);
    }
  };

  refreshToken = async (req, res, next) => {
    try {
      let token = req.headers['authorization'];
      
      token = token.replace("Refresh ", "");

      if (!token) {
        throw {
          code: 401,
          message: "Token is required",
          status: "TOKEN_REQUIRED",
      }
    }

    const authToken = await authServ.getSingleUserByFilter({
      maskedRefreshToken: token,
    })

    if (!authToken) {
      throw {
        code: 401,
        message: "Invalid token",
        status: "INVALID_TOKEN",
      }
    }

    const data = jwt.verify(authToken.refreshToken, AppConfig.jwtSecret)
    const userDetail = await userSvc.getSingleUserByFilter({
      _id: data.sub,
    })

    if (!userDetail) {
      throw {
        code: 422, 
        message: "User not found",
        status: "USER_NOT_FOUND"
      }
    }

    const accessToken = jwt.sign({
      sub: userDetail._id,
      typ: "Bearer",
     }, AppConfig.jwtSecret, {
      expiresIn: "1h",
     })

      const refreshToken = jwt.sign({
       sub: userDetail._id,
       typ: "refresh",
      }, AppConfig.jwtSecret, {
       expiresIn: "1d",
      })

      const maskedAccessToken = randomStringGenerator(150);
      const maskedRefreshToken = randomStringGenerator(150);

      const authData = {
        accessToken,
        refreshToken,
        maskedAccessToken,
        maskedRefreshToken,
      }

      await authServ.updateSingleRowByFilter({
        _id: authToken._id,
      }, authData);

      res.json({
        data: {
          accessToken: authData.maskedAccessToken,
          refreshToken: authData.maskedRefreshToken,
        },
        message: "New access token and refresh token generated successfully",
        status: "TOKEN_REFRESHED",
        options: null,
      });



    // TODO: time: 10min
        
    } catch (exception) {
      if (exception.hasOwnProperty('name') && exception.name === 'TokenExpiredError') {
        next({
          code: 401,
          message: exception.message,
          status: "TOKEN_EXPIRED",
        });
      } else {
        next(exception)
      }
    }
  }
}



module.exports = AuthController;