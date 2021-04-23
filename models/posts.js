const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    image: { type: Buffer },
    title: { type: String, required: true, min: 4, max: 30 },
    body: { type: String, required: true, min: 10 },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

postSchema.methods.toJSON = function () {
  post = this.toObject();
  delete post.image;
  return post;
};

postSchema.methods.saveImage = async function (image) {
  this.image = image;
  await this.save();
};

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
