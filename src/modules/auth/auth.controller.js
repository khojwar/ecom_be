
const userSvc = require('../user/user.service');
const authServ = require('./auth.service');

class AuthController {
  registerUser = async (req, res, next) => {
    try {
      const data = await authServ.transformUserCreate(req);

      // insert data into db
      let user = await userSvc.createUser(data);

      // Email
      await authServ.sendActivationNotification(user);

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


  loginUser = (req, res, next) => {
    // get email and password from req.body
    // if user not found

    res.status(200).json({
      data: null,
      message: "You are loggedIn",
      status: "Success",
      options: null,
    });
  };

  forgetPasswordRequest = (req, res, next) => {
    res.status(200).json({
      data: null,
      message: "forget password route",
      status: "Success",
      options: null,
    });
  };

  forgetPasswordVerify = (req, res, next) => {
    const token = req.params.token;

    res.status(200).json({
      data: token,
      message: "You are loggedIn",
      status: "Success",
      options: null,
    });
  };

  resetPassword = (req, res, next) => {
    res.status(200).json({
      data: null,
      message: "reset password route",
      status: "Success",
      options: null,
    });
  };

  loggedInUserProfile = (req, res, next) => {
    res.status(200).json({
      data: null,
      message: "Me route",
      status: "Success",
      options: null,
    });
  };

  logutUser = (req, res, next) => {
    res.status(200).json({
      data: null,
      message: "You are LoggedIn",
      status: "Success",
      options: null,
    });
  };

  updateUserById = (req, res, next) => {
    res.status(200).json({
      data: req.params.id,
      message: "Update user Router",
      status: "Success",
      options: null,
    });
  };
}



module.exports = AuthController;