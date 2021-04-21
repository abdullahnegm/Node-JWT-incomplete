var jwt = require("jsonwebtoken");
const Users = require("../models/users");

const Auth = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    let decoded = jwt.verify(token, `${process.env.SECRET}`);
    let user = await Users.findOne({ _id: decoded._id, "tokens.token": token });

    if (!user) throw new Error();

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    return res.status(403).send("You need to login");
  }
};

module.exports = Auth;
