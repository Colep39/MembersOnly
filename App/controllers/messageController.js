const messageModel = require('../models/messageModel');

exports.getMessages = async (req, res) => {
  try {
    const messages = await messageModel.getMessages();
    res.json(messages);
  } catch (err) {
    console.error("Error getting messages:", err);
    res.status(500).json({ error: 'Error fetching messages' });
  }
};

exports.createMessage = async (req, res) => {
    try {
      if (!req.user) return res.redirect("/log-in");
  
      const { title, content } = req.body;
      await messageModel.createMessage(req.user.id, title, content);
      
      res.redirect("/");
    } catch (err) {
      console.error("Insert error:", err);
      res.status(500).send("Failed to post message");
    }
  };
  
  exports.deleteMessage = async (req, res) => {
    if (!req.user || req.user.membership !== "Admin") {
        return res.status(403).send("Unauthorized");
    }
    try {
        const messageId = req.params.id;
        await messageModel.deleteMessage(messageId);

        res.redirect("/");
    }
    catch (err) {
        console.error("Error deleting message:", err);
        res.status(500).json({ error: 'Failed to delete message' });
    }
  };
