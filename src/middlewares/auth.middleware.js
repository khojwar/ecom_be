// ************ middleware for  ************
// check user access or verify isUserLoggedIn and check user role
// RVSC --> role based access control

const { AppConfig } = require("../config/config");
const authServ = require("../modules/auth/auth.service");
const jwt = require("jsonwebtoken");
const userSvc = require("../modules/user/user.service");
const { USER_ROLES } = require("../config/constant");

const auth = (role = null) => {
    return async (req, res, next) => {
        try {
            let token = req.headers["authorization"];
            
            if (!token) {
                throw {
                    status: 401,
                    message: "Authorized",
                    status: "UNAUTHORIZED",
                }
            }

            // Bearer token  => "token"
            token = token.replace("Bearer ", "");

            // db token
            const authData = await authServ.getSingleUserByFilter({
                maskedAccessToken: token,
            })

            if (!authData) {
                throw {
                    status: 401,
                    message: "Token not found",
                    status: "UNDEFINED_TOKEN",
                }
            }

            // console.log("authData: ", authData);
            
            const decodedData = jwt.verify(authData.accessToken, AppConfig.jwtSecret)

            // console.log("decodedData: ", decodedData);

            if (decodedData.typ !== "Bearer") {
                throw {
                    status: 401,
                    message: "Token not found",
                    code: "UNDEFINED_TOKEN",
                }
            }
            
            let userDetail = await userSvc.getSingleUserByFilter({
                _id: decodedData.sub,
            })

            if (!userDetail) {
                throw {
                    status: 403,
                    message: "User not found or already being deleted from the application",      
                    status: "USER_NOT_FOUND",
                }
            }

            userDetail = userSvc.getUserPublicProfile(userDetail);

            // console.log("userDetail: ", userDetail);
            
            if (userDetail.role === USER_ROLES.ADMIN || role === null || (Array.isArray(role) && role.includes(userDetail.role))) {
                req.loggedInUser = userDetail; 
                next();
            } else {
                throw {
                    status: 403,
                    message: "Access Denied",
                    status: "ACCESS_DENIED",
                }
            }

        } catch (exception) {
            console.error("Auth Middleware Error:", exception);
            // next(exception);
            if (exception.hasOwnProperty("name") && exception.name === "TokenExpiredError") {
                next({code: 401, message: exception.message, status: "TOKEN_EXPIRED"});
            } else {
                next(exception);
            }
                
        }

    }
}

module.exports = auth;