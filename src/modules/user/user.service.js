const { create } = require("./user.model");

class UserService {
    getUserPublicProfile(user) {
        return {
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            address: user.address,
            phone: user.phone,
            gender: user.gender,
            dob: user.dob,
            image: user.image,
            createdBy: user.createdBy,
            updatedBy: user.updatedBy,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }
    }
}

const userSvc = new UserService();
module.exports = userSvc;