'use strict'

const passport = require('passport');
const LocalPassport = require('passport-local').Strategy;

const User = require('../db/users');

passport.serializeUser((user, done) => {
    console.log('id: ', user.id);
    console.log('email: ', user.email);
    const t = Date.now();
    while (Date.now() - t < 2000) {}

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
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const user = await User.findOne({
            email
        });

        if (!user) {
            return done(null, false, {
                message: 'Incorrect email'
            });
        }

        const isValid = await User.comparePassword(password, user.password);
        if (!isValid) {
            return done(null, false, {
                message: 'Incorrect password.'
            });
        }
        return done(null, user);
    } catch (err) {
        done(err, false);
    }
});

passport.use(localPassport);