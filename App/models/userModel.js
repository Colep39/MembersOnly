const db = require("../db");
const bcrypt = require("bcryptjs");

exports.createUser = async (username, password, firstname, lastname, membership) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
        `INSERT INTO users (username, password, firstname, lastname, membership)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [username, hashedPassword, firstname, lastname, membership]
    );
    return result.rows[0].id;
}