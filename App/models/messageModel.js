const db = require("../db");

exports.getMessages = async () => {
    const result = await db.query(
    `SELECT 
     FROM messages m, users u
     WHERE m.user_id = u.id
    `
    );
    return result.rows;
};

exports.createMessage = async (userId, title, content, created_at) => {
    const result = await db.query(
    `INSERT INTO messages (user_id, title, content, created_at)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [userId, title, content, created_at]
    );
    return result.rows[0].id;
};