const { data } = require("autoprefixer");
const chatSvc = require("./chat.service");

class ChatController {
    async storeChat(req, res, next) {
        try {
            const chatData = chatSvc.transformChatData(req);

            const chat = await chatSvc.create(chatData);

            res.json({
                data: chat,
                message: "Chat message sent successfully",
                status: "CHAT_SENT_SUCCESS",
                options: null
            })

            
        } catch (exception) {
            next(exception);
        }
    }

    async getAllChats(req, res, next) {
        try {

            let filter = { 
                $or: [ { sender: req.loggedInUser._id, receiver: req.params.receiver },     // if sender is i am
                        { receiver: req.params.receiver, sender: req.loggedInUser._id }     // if receiver is i am
                ]   
            }

            // ------------ logic to filter chats can be added here ------------
            // 1. pagination can be added here if needed
            // 2. sorting can also be added here if needed
            // 3. search can also be added here if needed

            const {data, pagination} = await chatSvc.getAllRowByFilter(filter, req.query);


            res.json({
                data: data,
                message: "Chats retrieved successfully",
                status: "OK",
                options: {
                    pagination: pagination}
            });


        } catch (exception) {
            next(exception);
        }
    }
}

const chatCtrl = new ChatController();
module.exports = chatCtrl;