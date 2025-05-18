class AuthController {
    registerUser = (req, res) => {

        const data = req.body;        

        res.status(200).json({
            data: data,
            // data: req.user,
            message: "You are register",
            status: "Success",
            options: null,
        })
     }

     activateUser = (req, res) => {
        console.log(req.params);
        
        // const {token} = req.params;    OR
        const token = req.params.token; 
        // console.log(token);
    
        let params = req.params;
        const header = req.headers;
        const query = req.query;
        
    
        res.status(200).json({
            // data: token,
            data: {
                params,
                header,
                query
            },
            message: "User activated successfully",
            status: "success",
            options: null 
        })
    }

     loginUser = (req, res, next) => {
        // get email and password from req.body
        // if user not found 

        res.status(200).json({
            data: null,
            message: "You are loggedIn",
            status: "Success",
            options: null,
        })
    }

     forgetPasswordRequest = (req, res, next) => {
        res.status(200).json({
            data: null,
            message: "forget password route",
            status: "Success",
            options: null,
        })
    }


     forgetPasswordVerify = (req, res, next) => {
        const token = req.params.token;
    
        res.status(200).json({
            data: token,
            message: "You are loggedIn",
            status: "Success",
            options: null,
        })
    }

     resetPassword = (req, res, next) => {
        res.status(200).json({
            data: null,
            message: "reset password route",
            status: "Success",
            options: null,
        })
    }

     loggedInUserProfile = (req, res, next) => {
        res.status(200).json({
            data: null,
            message: "Me route",
            status: "Success",
            options: null,
        })
    }

     logutUser = (req, res, next) => {
        res.status(200).json({
            data: null,
            message: "You are LoggedIn",
            status: "Success",
            options: null,
        })
    }

     updateUserById = (req, res, next) => {

        res.status(200).json({
            data: req.params.id,
            message: "Update user Router",
            status: "Success",
            options: null,
        })
    }

}



module.exports = AuthController;