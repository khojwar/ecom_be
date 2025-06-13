const { genSalt } = require("bcryptjs");
const userSvc = require("./user.service");
const { options } = require("joi");

class UserController {
    async listAllUsers(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser; // user id from auth middleware

            let filter = {
                _id: { $ne: loggedInUser._id } // Exclude the logged-in user from the list
            };

            if (req.query.search) {
                filter = {
                    ...filter,
                    $or: [
                        { name: new RegExp(req.query.search, 'i') },
                        { email: new RegExp(req.query.search, 'i') },
                        { phone: new RegExp(req.query.search, 'i') },
                        { gender: new RegExp(req.query.search, 'i') },
                        { "address.billingAddress": new RegExp(req.query.search, 'i') },
                        { "address.shippingAddress": new RegExp(req.query.search, 'i') }
                    ],
                };
            }

            if (req.query.role) {
                filter = {
                    ...filter,
                    role: req.query.role
                }
            }

            const { data, pagination } = await userSvc.getAllUsersByFilter(req.query, filter);

            res.json({
                data: data,
                message: "All user data",
                status: "USER_LIST_SUCCESS",
                options: { pagination }
            });
            
        } catch (exception) {
            next(exception);
        }
    }

    async getUserById(req, res, next) {
        try {
            console.log("Fetching user details for userId:", req.params.userId);
            
            const userId = req.params.userId;
            const userDetail = await userSvc.getSingleUserByFilter({ _id: userId });

            if (!userDetail) {
                throw {
                    code: 422,
                    message: "User does not exist",
                    status: "USER_NOT_FOUND"
                };
            }

            res.json({
                data: userDetail,
                message: "User details fetched successfully",
                status: "USER_DETAIL_SUCCESS",
                options: null
            })
            
        } catch (exception) {
            next(exception);   
        }
    }

}
const userCtr = new UserController();
module.exports = userCtr;