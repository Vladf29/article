'use strict'

const randomString = require('randomstring');

const mailer = require('../modules/mailer');
const User = require('../db/users');

module.exports = {
    signUpUser: async (req, res) => {
        const exist = await User.findOne({
            email: req.value.body.email
        });
        if (exist) return res.status(400).send('The same email is already existed');

        const hash = await User.hashPassword(req.value.body.password);
        req.value.body.password = hash;

        const tokenConfirmEmail = randomString.generate(32);
        req.value.body.tokenConfirmEmail = tokenConfirmEmail;

        const newUser = await User(req.value.body);
        const user = await newUser.save();

        const html = `
            <p>Hello</p>
            <p>Please confirm your email address by clicking on the link below.</p>
            <p>
                <a href='http://localhost:3000/form/verify/${tokenConfirmEmail}'><b>'htttp://localhost:3000/form/verify/${tokenConfirmEmail}'</b></a>
            </p>
            <p>Happy emailing!</p>
        `
        await mailer.sendEmail('admin@codesite.com', req.body.email, 'Please', html);

        req.flash('success', 'Please check your email');
        console.log(user);
        res.json(user);
    },
    logInUser: async (req, res) => {
        res.redirect('/me/bookmarks')
    },
    verifyEmail: async (req, res) => {
        const tokenConfirmEmail = req.params.tokenConfirmEmail;
        const user = await User.findOne({
            tokenConfirmEmail
        });

        if (!user) {
            req.flash('error', 'Something went wrong');
        } else if (user.emailActive) {
            req.flash('success', 'The email is already active');
        } else {
            user.emailActive = true;
            await user.save();
            req.flash('success', 'The email is confirmed successfully');
        }
        res.redirect('/');
    }
};