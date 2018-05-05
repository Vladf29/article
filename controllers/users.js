'use strict'

const User = require('../db/users');

module.exports = {
    renderProfilePage: (req, res) => {
        res.render('me/profile');
    },
    renderSettingsPage: (req, res) => {
        res.render('me/settings');
    },

    updateUserEmail: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        if (!user.emailActive) {
            req.flash('error', 'You can\'t change your email while you don\'t confirm your current email!');
            return res.status(302).send();
        }

        const isEmail = await User.findOne({
            email: req.value.body.email
        });
        if (isEmail) {
            req.flash('error', 'The email is already exist!');
            return res.status(302).send();
        }

        const isValidPassword = await User.comparePassword(req.value.body.password, user.password);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.email = req.value.body.email;
        await user.save();
        req.flash('success', 'Email was changed');
        res.send('Ok');
    },
    updateUserUsername: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        const isValidPassword = await User.comparePassword(req.value.body.password, user.password);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.username = req.value.body.username;
        await user.save();
        req.flash('success', 'Username was changed');
        res.send('Ok');
    },
    updateUserPassword: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        const isValidPassword = await User.comparePassword(req.value.body.oldPassword, user.password);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.password = await User.hashPassword(req.value.body.newPassword);
        await user.save();
        req.flash('success', 'Password was changed');
        res.send('Ok');
    },
    updateUserName: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            name: req.body.name
        });
        res.send('OK');
    },
    updateUserDescribe: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            describe: req.body.describe
        });
        res.send('OK');
    },
    updateUserAboutMe: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            aboutMe: req.body.aboutMe
        });
        res.send('OK');
    }
}