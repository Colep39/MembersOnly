const db = require("../db");

exports.getMessages = async () => {
  const result = await db.query(`
    SELECT messages.*, users.username 
    FROM messages 
    JOIN users ON messages.user_id = users.id 
    ORDER BY messages.created_at DESC
  `);
  return result.rows;
};

exports.createMessage = async (userId, title, content) => {
  const result = await db.query(
    `INSERT INTO messages (user_id, title, content)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [userId, title, content]
  );
  return result.rows[0].id;
};

exports.deleteMessage = async (messageId) => {
    await db.query(`
        DELETE FROM messages
        WHERE id = $1
    `, [messageId])
    .catch(err => {
        console.error("Error deleting message:", err);
        throw new Error("Failed to delete message");
    });
    return messageId;
}
