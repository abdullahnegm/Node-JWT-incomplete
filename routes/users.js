const express = require("express");
const userRoute = express();

// Users Model
const Users = require("../models/users");

// Require ejs template engine
// const ejs = require("ejs");
// userRoute.set("view engine", "ejs");

// Validation
const userSchema = require("../validation/user");
const validator = require("express-joi-validation").createValidator({});

// Middlewares
const Auth = require("../middlewares/authMiddleware");

// Authentication using Passport
const passport = require("passport");

const initializePassport = require("./helpers/passport-config");
initializePassport(passport);

const flash = require("express-flash");
const session = require("express-session");

app.use(flash());
app.use(session());

app.use(passport.initialize());
app.use(
  passport.session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

var bodyParser = require("body-parser");

userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

userRoute.get("/", async (req, res, next) => {
  try {
    let users = await Users.find({});
    return res.send(users);
  } catch (e) {
    next(e);
  }
});

userRoute.get("/register", (req, res) => {
  return res.render("register");
});

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

// userRoute.get("/login", (req, res) => {
//   return res.render("login");
// });

userRoute.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let user = await Users.findById(id);
    return res.send(user);
  } catch (e) {
    next(1);
  }
});

userRoute.get("/profile", Auth, async (req, res, next) => {
  try {
    return res.send(req.user);
  } catch (e) {
    next(1);
  }
});

// userRoute.post("/login", async (req, res, next) => {
//   try {
//     let user = await Users.check_user(req.body);
//     let token = await user.generateJWT();
//     return res.send({ user, token });
//   } catch (e) {
//     return res.status(400).send("Wrong Credentials");
//   }
// });

//  validator.body(userSchema),

userRoute.post("/register", async (req, res, next) => {
  try {
    let validationResult = userSchema.validate(req.body);
    if (validationResult.error) return res.status(400).render("register");

    let user = await Users.create(req.body);

    return res.send("User Register Succesfully");
  } catch (e) {
    next(e);
  }
});

userRoute.delete("/:id", async (req, res, next) => {
  try {
    await req.user.remove();
    return res.send(req.user);
  } catch (e) {
    next(e);
  }
});

userRoute.patch("/:id", async (req, res, next) => {
  const allowed_inputs = ["username", "password", "firstname"];
  const keys = Object.keys(req.body);
  const isIncluded = keys.every((key) => allowed_inputs.includes(key));

  if (!isIncluded) return res.render("wrong");

  try {
    keys.forEach((key) => (req.user[key] = req.body[key]));
    await req.user.save();
    return res.send(user);
  } catch (e) {
    next(e);
  }
});

userRoute.get("/:id/isfollowed", Auth, (req, res) => {
  req.user.is_followed(req.params.id);
  return res.send("lol");
});

userRoute.get("/:id/follow", Auth, async (req, res, next) => {
  let id = req.params.id;

  try {
    let user = await Users.findById(id);
    if (!user) next(1);

    let user_follow = await req.user.check_follows(id);
    return res.send(user_follow);
  } catch (e) {
    next(e);
  }
});

userRoute.use((err, req, res, next) => {
  if (err == 1) return res.status(404).send("This user doesn't exist");
  return res.status(500).send(err);
});

module.exports = userRoute;
