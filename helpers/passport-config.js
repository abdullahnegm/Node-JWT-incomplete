const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const Users = require("../models/users");

function initialize(passport) {
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await Users.findOne({ email: email });
      if (!user)
        return done(null, false, { message: "User or Password incorrect" });

      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "User or Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  const getUserById = async (id) => {
    let user = await Users.findById(id);
    return user.id;
  };

  passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id);
    return done(null, user);
  });
  // passport.deserializeUser((id, done) => {
  //   return done(
  //     null,
  //     getUserById(id).then((res) => {
  //       return res;
  //     })
  //   );
  // });
}

module.exports = initialize;
