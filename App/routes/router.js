const express = require('express');
const router = express.Router();

const messageController = require('../controllers/messageController');
const userController = require('../controllers/userController');

router.get('/messages', messageController.getMessages);
router.post('/messages', messageController.createMessage);
// router.get('/users', userController.getUsers);
router.post('/users', userController.createUser);
router.delete('/messages/:id', messageController.deleteMessage);

module.exports = router;