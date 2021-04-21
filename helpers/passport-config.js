const localStrategy = require("passport-local");
const bcrypt = require('bcrypt')

const Users = require('../models/users')



function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        var user = await Users.findOne({email: email})
        if(!user) return done(null, false, {message: "User or Password incorrect"})

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else {
                return done(null, false, {message: "User or Password incorrect"})
            }
        } catch(e) {
            return done(e)
        }
    }
    passport.use(new localStrategy({usernameField = "email"}, authenticateUser));
    passport.serializeUser((user, done) => {})
    passport.deserializeUser((id, done) => {})
};

module.exports = initialize