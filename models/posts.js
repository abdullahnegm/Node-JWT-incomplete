const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    image: { type: Buffer },
    title: { type: String, required: true, min: 6, max: 30 },
    body: { type: String, required: true, min: 10 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    tags: [{ tag: { type: String } }],
  },
  { timestamps: true }
);

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
