'use strict'

const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;

const User = require('../db/users');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const localPassport = new LocalPassport({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return done(null, false);
        }

        const isValid = await user.comparePassword(password);
        if (!isValid) {
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});

passport.use(localPassport);