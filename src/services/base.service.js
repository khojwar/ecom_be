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
}

module.exports = BaseService;

