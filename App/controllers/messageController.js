const messageModel = require('../models/messageModel');
const db = require('../db');

exports.getMessages = async (req, res) => {
    const messages = await messageModel.getMessages();
    res.json(messages);
}

exports.createMessage = async (req, res) => {
    const { userId, title, content, created_at } = req.body;
    
    try{
        const message = await messageModel.createMessage(userId, title, content, created_at);
        res.status(201).json({ message: 'Message created successfully', id: message });
    }
    catch(err){
        console.error(error);
        res.status(500).json({ error: 'Error creating the message'});
    }
};