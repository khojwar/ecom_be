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

// --------------------------------------
    async getAllUsersByFilter(query, filter = {}) {
        try {
            const page = +query.page || 1;
            const limit = +query.limit || 10;
            const skip = (page - 1) * limit;

            const data = await UserModel.find(filter)
                .sort({name: "desc"})
                .skip(skip)
                .limit(limit);

            const count = await UserModel.countDocuments(filter);

            return {
                data: data.map(userDetail => this.getUserPublicProfile(userDetail)),
                pagination: {
                    current: page,
                    limit: limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                }
            }

            return {
                data,
                pagination: {
                    total,
                    page,
                    limit
                }
            };
        } catch (exception) {
            console.log("Error in getAllUsersByFilter", exception);
            throw exception;   
        }
    }



}

const userSvc = new UserService();
module.exports = userSvc;