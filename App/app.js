const path = require("node:path");
require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const LocalStrategy = require('passport-local').Strategy;
const routes = require("./routes/router");

const pool = require("./db");

const app = express();
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const methodOverride = require("method-override");
app.use(methodOverride('_method'));

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));
// Passport session setup
app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use("/", routes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT messages.*, users.username
      FROM messages
      JOIN users ON messages.user_id = users.id
      ORDER BY messages.created_at DESC
    `);
    res.render("index", { user: req.user, messages: result.rows });
  } catch (err) {
    console.error("DB error:", error);
    res.status(500).send("Error fetching messages");
  }
});


app.get("/sign-up", (req, res) => res.render("sign-up-form", { user: req.user }));
app.get("/log-in", (req, res) => res.render("log-in-form", { user: req.user }));
app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
});  

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

app.post("/sign-up", async (req, res, next) => {
  console.log("Sign-up POST hit with:", req.body.username);
  try {
   const hashedPassword = await bcrypt.hash(req.body.password, 10);
   await pool.query("insert into users (username, password) values ($1, $2)", [req.body.username, hashedPassword]);
   res.redirect("/");
  } catch (error) {
     console.error(error);
     next(error);
    }
 });



passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = rows[0];

    done(null, user);
  } catch(err) {
    done(err);
  }
});


app.listen(3000, () => console.log("app listening on port 3000!"));