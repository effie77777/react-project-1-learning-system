const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const passport = require("passport");
const User = require("../models").userModel;

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
opts.secretOrKey = process.env.PASSPORT_SECRET;

passport.use(new jwtStrategy(opts, async(jwt_payload, done) => {
    await User.findOne({ _id: jwt_payload._id })
    .then((foundUser) => {
        if (!foundUser) {
            return done(null, false);
        } else {
            return done(null, foundUser);
        }   
    })
    .catch((err) => {
        return done(err);
    })
}))
