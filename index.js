const express = require("express");
const app = express();

require("dotenv").config();

// DB file
require("./helpers/connectToDB");

// View Engine [ejs]
const ejs = require("ejs");
app.set("view engine", "ejs");

// #########################################################
// #########################################################
// Authentication using Passport
const passport = require("passport");

const initializePassport = require("./helpers/passport-config");
initializePassport(passport);

const flash = require("express-flash");
const session = require("express-session");

app.use(flash());
app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// #########################################################
// #########################################################

app.set(express.json());

// Import Routes
const userRoute = require("./routes/users");
const postRoutes = require("./routes/posts");

app.use(["/users", "/user"], userRoute);
app.use(["/posts", "/post"], postRoutes);

app.use("*", (req, res) => {
  res.render("error");
});

app.listen(3000, () => {
  console.log("Server is Running");
});
