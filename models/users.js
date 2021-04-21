const mongoose = require("mongoose");

// Follow helpers
const unfollow = require("../helpers/unfollow");

// JWT Token
var jwt = require("jsonwebtoken");

// Hashing Password
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  username: { type: String, required: true, min: 3, max: 20 },
  password: { type: String, required: true, min: 8, max: 20 },
  email: { type: String, required: true },
  address: { type: String, required: true, min: 8, max: 40 },
  age: { type: Number, required: true, min: 18 },
  follows: { type: [mongoose.Schema.Types.ObjectId], ref: "Posts" },
  tokens: [{ token: { type: String } }],
});

userSchema.methods.toJSON = function () {
  let user = this.toObject();
  delete user.password;
  delete user.__v;
  delete user.tokens;
  return user;
};

userSchema.methods.generateJWT = async function () {
  var token = await jwt.sign({ _id: this._id }, `${process.env.SECRET}`);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.methods.check_follows = async function (id) {
  // Check if user in Followed list
  if (this.follows.includes(id)) {
    // Remove the user from the follow list
    this.follows = unfollow(this.follows, id);
    await this.save();
    return false;
  }

  // add the user to the follow list
  this.follows.push(id);
  await this.save();
  return true;
};

// Check users credentials for login and return the user
userSchema.statics.check_user = async function ({ username, password }) {
  let user = await this.findOne({ username });
  if (!user) throw new Error("Username or password are wrong");
  let isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Username or password are wrong");
  return user;
};

// Check if the user is followed
userSchema.methods.is_followed = function is_followed(id) {
  if (this.follows.includes(id)) return true;
  return false;
};

// hash the password everytime a users password is created or updated
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(
      this.password,
      Number(process.env.SALT_ROUNDS)
    );
  }

  next();
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
