class BaseService {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const dataObj = new this.model(data)
            return await dataObj.save();
        } catch (exception) {
            throw exception;
        }
    }

    async getSingleRowByFilter(filter) {
        try {
            const data = await this.model.findOne(filter)
            .populate('createdBy', ['_id', 'name', 'email', 'image', 'role', 'status'])
            .populate('updatedBy', ['_id', 'name', 'email', 'image', 'role', 'status']);

            return data;

        } catch (exception) {
            throw exception;
        }
    }

    async updateSingleRowByFilter(filter, data) {
        const updatedData = await this.model.findOneAndUpdate(filter, { $set: data }, { new: true });
        return updatedData;
    }

}

module.exports = BaseService;

