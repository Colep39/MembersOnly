const userModel = require("../models/userModel");
const db = require("../db");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.createUser = async (req, res) => {
    const { username, password, firstname, lastname, membership } = req.body;

    try{
        const userId = await userModel.createUser(username, password, firstname, lastname, membership);
        res.status(201).json({ message: 'User created successfully', id: userId });
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Error creating the user'});
    }
}

