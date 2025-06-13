const bcrypt= require("bcryptjs");
const userSvc = require("./user.service");
const cloudinarySvc = require("../../services/cloudinary.service");


class UserController {
    async listAllUsers(req, res, next) {
        try {
            const loggedInUser = req.loggedInUser; // user id from auth middleware

            let filter = {
                _id: { $ne: loggedInUser._id },// Exclude the logged-in user from the list
                deletedAt: {$eq: null} // Ensure we only get active users
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
            const userDetail = await userSvc.getSingleUserByFilter({ 
                _id: userId,
                deletedAt: { $eq: null } // Ensure we only get active users
            });

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

    async updateUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            const userData = req.body;

            const existingUser = await userSvc.getSingleUserByFilter({
                _id: userId,
                deletedAt: { $eq: null } 
            })

            if (!existingUser) {
                throw {
                    code: 422,
                    message: "User does not exist",
                    status: "USER_NOT_FOUND"
                };
            }

            const updatePayload = {};

            // Only update if fields are provided
            if (userData.name) updatePayload.name = userData.name;
            if (userData.phone) updatePayload.phone = userData.phone;
            if (userData.gender) updatePayload.gender = userData.gender;
            if (userData.dob) updatePayload.dob = userData.dob;
            if (userData.address) updatePayload.address = userData.address;
            if (userData.role) updatePayload.role = userData.role;

            // If password is provided, hash it
            if (userData.password) {
                updatePayload.password = await bcrypt.hash(userData.password, 10);
            }

            // Handle image upload
            if (req.file) {
                const uploadedImage = await cloudinarySvc.fileUpload(req.file.path, '/user/');
                updatePayload.image = uploadedImage;
            } 

            updatePayload.updatedBy = req.loggedInUser._id;

            const updatedUser = await userSvc.updateSingleUserByFilter({ _id: userId }, updatePayload);

            res.json({
                code: 200,
                data: userSvc.getUserPublicProfile(updatedUser),
                message: "User updated successfully",
                status: "USER_UPDATE_SUCCESS",
                options: null
            });

        } catch (exception) {
            next(exception);
        }
    }

    async softDeleteUserById(req, res, next) {
        try {
            const userId = req.params.userId;
            const deletedUser = await userSvc.softDeleteUserById(userId, req.loggedInUser._id);

            if (!deletedUser) {
                throw { 
                    code: 404, 
                    data: null,
                    message: "User not found", 
                    status: "USER_NOT_FOUND",
                    options: null 
                };
            }

            // console.log("User soft deleted:", deletedUser);
            
            

            res.json({
                code: 200,
                data: userSvc.getUserPublicProfile(deletedUser),
                message: "User moved to trash",
                status: "USER_SOFT_DELETE_SUCCESS",
                options: null
            });

        } catch (exception) {
            next(exception);  
        }
    }

    async restoreUser(req, res, next) {
        try {
            const userId = req.params.userId;
            const restoredUser = await userSvc.restoreUserById(userId, req.loggedInUser._id);

            if (!restoredUser) {
                throw {
                    code: 404,
                    message: "User not found",
                    status: "USER_NOT_FOUND"
                };
            }

            res.json({
                code: 200,
                data: userSvc.getUserPublicProfile(restoredUser),
                message: "User restored successfully",
                status: "USER_RESTORE_SUCCESS",
                options: null
            });

        } catch (exception) {
            next(exception);  
        }
    }

    // Hard delete user permanently
    async hardDeleteUser(req, res, next) {
        try {
            const { userId } = req.params;
            const deletedUser = await userSvc.hardDeleteUserById(userId);

            if (!deletedUser) {
                throw { code: 404, message: "User not found", status: "USER_NOT_FOUND" };
            }

            res.json({
                data: null,
                message: "User permanently deleted",
                status: "USER_HARD_DELETE_SUCCESS"
            });
            
        } catch (exception) {
            next(exception);
        }
    }




}
const userCtr = new UserController();
module.exports = userCtr;