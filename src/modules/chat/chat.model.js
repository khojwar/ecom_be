const { message } = require('laravel-mix/src/Log');
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        min: 1,
        max: 2000,
    },

}, {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
});

const ChatModel = mongoose.model('Chat', chatSchema);
module.exports = ChatModel;