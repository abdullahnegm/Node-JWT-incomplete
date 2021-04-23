const express = require("express");
const postRoutes = express();

var methodOverride = require("method-override");
postRoutes.use(methodOverride("_method"));

const path = require("path");

// Post Model
const Posts = require("../models/posts");
const Users = require("../models/users");

// Post Validation [ Joi ]
const postSchema = require("../validation/posts");
const validator = require("express-joi-validation").createValidator({});

// Middlewares
const Auth = require("../middlewares/authMiddleware");
const isAuth = require("../middlewares/isAuthenticated");
const isNotAuth = require("../middlewares/isNotAuthenticated");
const Paginate = require("../middlewares/pagination");

postRoutes.use(express.json());

var multer = require("multer");

var upload = multer({ limits: { fileSize: 1000000 } });

const images_path = path.join(__dirname + "/../views/images");
postRoutes.use(express.static(images_path));

const bodyParser = require("body-parser");
postRoutes.use(bodyParser.urlencoded({ extended: true }));

postRoutes.get("/image/:id", async (req, res, next) => {
  console.log("Here 1");
  try {
    let id = req.params.id;
    let post = await Posts.findById(id);
    if (!post) return res.send(null);
    if (!post.image) return res.send("images.jpg");
    return res.set("Content-Type", "image/jpg").send(post.image);
  } catch (e) {
    next(e);
  }
});

postRoutes.post("/photo", upload.single("avatar"), async (req, res, next) => {
  console.log("Here 2");
  let post = await Posts.findById(req.body._id);
  await post.saveImage(req.file.buffer);
  return res.set("Content-Type", "image/jpg").send(req.file.buffer);
});

postRoutes.get("/", Paginate(Posts), async (req, res, next) => {
  try {
    if (req.user)
      return res.render("home", {
        posts: res.paginatedResults,
        user: req.user,
      });
    return res.render("home", { posts: res.paginatedResults });
  } catch (e) {
    next(e);
  }
});

postRoutes.get(
  "/follows",
  isAuth,
  Paginate(Posts, (limited = true)),
  async (req, res, next) => {
    try {
      console.log(req.user.follows);

      return res.render("home", {
        posts: res.paginatedResults,
        user: req.user,
      });
    } catch (e) {
      next(e);
    }
  }
);

postRoutes.get("/create", isAuth, (req, res, next) => {
  console.log("create post");
  return res.render("create");
});

postRoutes.get("/:id", async (req, res, next) => {
  console.log("Here 4");
  try {
    let id = req.params.id;
    let post = await Posts.findById(id).populate("author").exec();
    console.log(post);
    console.log(req.user);
    if (req.user) return res.render("details", { post, user: req.user });
    return res.render("details", { post });
  } catch (e) {
    next(1);
  }
});

postRoutes.post(
  "/",
  isAuth,
  upload.single("avatar"),
  async (req, res, next) => {
    console.log("Here 5");
    try {
      var { title, body, tags } = req.body;
      if (tags) tags = tags.split(",");
      else tags = [];
      let validationResult = postSchema.validate({ title, body, tags });
      if (validationResult.error)
        return res.status(400).send(validationResult.error);
      // if (validationResult.error) return res.status(400).render("create");

      let post = await Posts.create({
        title,
        body,
        tags,
        author: req.user._id,
      });

      if (req.file) await post.saveImage(req.file.buffer);

      return res.redirect("/posts");
    } catch (e) {
      next(e);
    }
  }
);

postRoutes.delete("/:id", async (req, res, next) => {
  console.log("Here 6");
  try {
    let id = req.params.id;

    let post = await Posts.findOne({ _id: id }).populate("author").exec();
    if (!post) return next(1);

    if (post.author._id.toString() != req.user._id) next(2);

    await post.remove();
    return res.redirect("/posts");
  } catch (e) {
    next(e);
  }
});

postRoutes.patch("/:id", async (req, res, next) => {
  console.log("Here 7");
  const allowed_inputs = ["title", "body", "author", "tags"];
  const keys = Object.keys(req.body);
  const isIncluded = keys.every((key) => allowed_inputs.includes(key));

  if (!isIncluded) return res.render("wrong");

  try {
    let id = req.params.id;
    let post = await Posts.findOne({ _id: id });
    if (!post) next(1);

    if (post.author.toString() != req.user._id) next(2);

    keys.forEach((key) => {
      post[key] = req.body[key];
    });

    await post.save();
    return res.send(post);
  } catch (e) {
    next(e);
  }
});

postRoutes.use((err, req, res, next) => {
  console.log("Here 8");
  if (err == 1) return res.status(404).send("This post doesn't exist");
  if (err == 2) return res.status(403).send("You are not Authorized");
  return res.status(500).send(err);
});

module.exports = postRoutes;
