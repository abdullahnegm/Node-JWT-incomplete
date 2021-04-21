const express = require("express");
const postRoutes = express();
require("express-reverse")(postRoutes);

const path = require("path");

// Post Model
const Posts = require("../models/posts");
const Users = require("../models/users");

// Post Validation [ Joi ]
const postSchema = require("../validation/posts");
const validator = require("express-joi-validation").createValidator({});

// Middlewares
const Auth = require("../middlewares/authMiddleware");

postRoutes.use(express.json());

var multer = require("multer");

var upload = multer({ limits: { fileSize: 1000000 } });

const images_path = path.join(__dirname + "/../views/images");
postRoutes.use(express.static(images_path));

const bodyParser = require("body-parser");
postRoutes.use(bodyParser.urlencoded({ extended: true }));

postRoutes.get("/image/:id", async (req, res, next) => {
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
  let post = await Posts.findById("607db54a3ff09b0c4cb6bcae");
  post.image = req.file.buffer;
  await post.save();
  return res.set("Content-Type", "image/jpg").send(req.file.buffer);
});

postRoutes.get("home", "/", async (req, res, next) => {
  let user = await Users.findOne({ _id: "607cb5fa651e5049b0a3a85f" });
  try {
    let posts = await Posts.find({}).populate("author").exec();
    return res.render("home", { posts, user });
    // return res.render("home", { posts, user: req.user });
  } catch (e) {
    next(e);
  }
});

// postRoutes.get("/", async (req, res, next) => {
//   try {
//     let posts = await Posts.find({});
//     res.send(posts);
//   } catch (e) {
//     next(e);
//   }
// });

postRoutes.get("/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    await Posts.findById(id);
    return res.send(post);
  } catch (e) {
    next(1);
  }
});

postRoutes.post(
  "/",
  Auth,
  validator.body(postSchema),
  async (req, res, next) => {
    try {
      let post = await Posts.create({ ...req.body, author: req.user._id });

      res.send({ post });
    } catch (e) {
      next(e);
    }
  }
);

postRoutes.delete("/:id", Auth, async (req, res, next) => {
  try {
    let id = req.params.id;

    let post = await Posts.findOne({ _id: id });
    if (!post) next(1);

    if (post.author.toString() != req.user._id) next(2);

    await post.remove();
    return res.send(post);
  } catch (e) {
    next(e);
  }
});

postRoutes.patch("/:id", Auth, async (req, res, next) => {
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
  if (err == 1) return res.status(404).send("This post doesn't exist");
  if (err == 2) return res.status(403).send("You are not Authorized");
  return res.status(500).send(err);
});

module.exports = postRoutes;
