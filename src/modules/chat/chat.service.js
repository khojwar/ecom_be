const BaseService = require('../../services/base.service');
const ChatModel = require('./chat.model');

class ChatService extends BaseService {
    transformChatData(req) {
        return {
            sender: req.loggedInUser._id,
            receiver: req.body.receiver,
            message: req.body.message
        }
    }

    async getAllRowByFilter(filter, query = {}) {
        try {

            const page = query.page ? parseInt(query.page) : 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;

            const data = await ChatModel.find(filter)
                .populate('sender', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .populate('receiver', ['_id', 'name', 'email', 'image', 'role', 'status'])
                .sort({createdAt: "desc"})
                .skip(skip)
                .limit(limit)
            
            const count = await ChatModel.countDocuments(filter);
    
            return {
                data: data,
                pagination: {
                    current: page,
                    limit: limit,
                    total: count,
                    totalPages: Math.ceil(count / limit),
                    }
            };

        } catch (exception) {
            throw exception;
        }
    }


}

const chatSvc = new ChatService(ChatModel);
module.exports = chatSvc;