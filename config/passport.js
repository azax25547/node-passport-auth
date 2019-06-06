const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bc = require('bcryptjs')

const User = require('../models/users')

module.exports = (passport) => {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            // find email
            User.findOne({ email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: "Email not registered" })
                    }
                    // match the password
                    bc.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Incorrect Password" })
                        }
                    })
                })
        })
    )

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });
}