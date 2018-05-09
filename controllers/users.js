'use strict'

const fs = require('fs');
const mzFs = require('mz/fs');

const User = require('../db/users');

const pathToDraftArticles = './asset/users/draftArticles';

const pages = {
    renderProfile: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });
        res.render('me/profile', {
            owner: true,
            user
        });
    },
    renderSettings: (req, res) => {
        res.render('me/settings');
    },
    writePost: (req, res) => {
        res.render('editor');
    },
    renderPosts: async (req, res) => {
        const user = await User.findById(req.user.id);
        const arr = [];
        for (const k of user.draft) {
            const data = await mzFs.readFile(`${pathToDraftArticles}/(${k})${req.user.id}.json`, 'utf8');
            const a = {
                id: k,
                data: JSON.parse(data)
            }
            arr.push(a);
        }
        res.json(arr);
    }
}

const updates = {
    userEmail: async (req, res) => {
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

        const isValidPassword = await user.comparePassword(req.value.body.password);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.email = req.value.body.email;
        await user.save();
        req.flash('success', 'Email was changed');
        res.send('Ok');
    },
    userUsername: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        const isValidPassword = await user.comparePassword(req.value.body.password);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.username = req.value.body.username;
        await user.save();
        req.flash('success', 'Username was changed');
        res.send('Ok');
    },
    userPassword: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        const isValidPassword = await user.comparePassword(req.value.body.oldPassword);
        if (!isValidPassword) {
            req.flash('error', 'The password is incorrect!');
            return res.status(302).send();
        }

        user.password = req.value.body.newPassword;
        await user.hashPassword();
        await user.save();
        req.flash('success', 'Password was changed');
        res.send('Ok');
    },
    userName: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            name: req.body.name
        });
        res.send('OK');
    },
    userDescribe: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            describe: req.body.describe
        });
        res.send('OK');
    },
    userAboutMe: async (req, res) => {
        await User.findOneAndUpdate({
            email: req.user.email
        }, {
            aboutMe: req.body.aboutMe
        });
        res.send('OK');
    },
    userAvatarUrl: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });

        const currentImg = user.avatarUrl;
        if (!/^(http|https):\/\//.test(currentImg) && currentImg) {
            fs.unlink('./' + currentImg);
        }

        user.avatarUrl = req.body.url
        await user.save();
        res.send('OK');
    },
    userAvatarImg: (req, res) => {
        const targetPath = `${req.file.destination}/${Date.now()}${req.file.originalname}`;
        const tmpPath = req.file.path;

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);
        src.pipe(dest);

        src.on('end', async () => {
            fs.unlink(tmpPath);
            const user = await User.findOne({
                email: req.user.email
            });

            const currentImg = user.avatarUrl;
            if (!/^(http|https):\/\//.test(currentImg) && currentImg) {
                fs.unlink('./' + currentImg);
            }

            user.avatarUrl = targetPath.replace('.', '');
            await user.save();
            res.send('OK');
        });

        src.on('error', () => {

        });
    },
}

const writePost = {
    create: async (req, res) => {
        const user = await User.findById(req.user.id);
        const idDraft = user.draft[user.draft.length - 1] ? +user.draft[user.draft.length - 1] + 1 : 0;
        res.send(`${idDraft}`);
    },
    draft: async (req, res) => {
        // const user = await User.findById(req.user.id);
        // if (!user.draft.includes(req.body.id)) {
        //     user.draft.push(req.body.id);
        //     await user.save();
        // }
        // const wr = fs.createWriteStream(`${pathToDraftArticles}/(${req.body.id})${req.user.id}.json`);
        // wr.write(JSON.stringify(req.body.data));
        // wr.end(null);

        // wr.on('error', (err) => console.log(err));
        // wr.on('finish', () => {
        //     res.send('OK');
        // });
        res.send('OK')
    }
}

module.exports = {
    pages,
    updates,
    writePost,
    userDeleteAccount: async (req, res) => {
        const user = await User.findOne({
            email: req.user.email
        });
        req.logOut();

        const currentImg = user.avatarUrl;
        if (!/^(http|https):\/\//.test(currentImg) && currentImg) {
            fs.unlink('./' + currentImg);
        }

        await user.remove();
        res.send('Ok');
    }
}