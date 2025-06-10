const UserModel = require("./user.model");
const { create } = require("./user.model");

class UserService {
    getUserPublicProfile(user) {
        return {
            _id: user._id,
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

    async createUser(data) {
      try {

        const user = await UserModel.create(data);
        return await user.save();
        
      } catch (exception) {
        throw exception;
      }
    }

    getSingleUserByFilter = async (filter) => {
        try {
            const userData = await UserModel.findOne(filter);
            return userData;
            
        } catch (exception) {
            console.log("Error in getSingleUserByFilter", exception);
            throw exception;
        }
    }

    async updateSingleUserByFilter (filter, data) {
        try {
            const userData = await UserModel.findOneAndUpdate(filter, {$set: data}, {new: true});
            return userData;
        } catch (exception) {
            console.log("Error in updateSingleUserByFilter", exception);
            throw exception;
        }
    }



}

const userSvc = new UserService();
module.exports = userSvc;