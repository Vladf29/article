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
            // req.flash('error', 'Incorrect email');
            return done(null, false);
        }

        const isValid = await user.comparePassword(password);
        console.log('>>>', isValid);
        if (!isValid) {
            // req.flash('error', 'Incorrect password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});

passport.use(localPassport);