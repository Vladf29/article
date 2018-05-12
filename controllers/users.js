'use strict'

const fs = require('fs');
const mzFs = require('mz/fs');


const User = require('../db/users');
const Article = require('../db/articles');

const pathToDraftArticles = './asset/users/draftArticles';

const pages = {
    renderProfile: async (req, res) => {
        const user = await User.findById(req.user.id);
        res.render('me/aboutMe', {
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
        const posts = await Article.find({});
        res.render('me/posts', {
            owner: true,
            user,
            posts
        })
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
        let idDraft = user.draft[user.draft.length - 1] ? user.draft[user.draft.length - 1] : 0;
        idDraft = idDraft !== 0 ? idDraft.match(/\(\d+?\)/g)[0].match(/\d+?/g)[0] * 1 + 1 : 0;
        idDraft = `(${idDraft})${req.user.id}`;
        res.send(idDraft);
    },
    downloadDraft: async (req, res) => {
        const user = await User.findById(req.user.id);
        const idDraft = req.query.draft
        if (!idDraft) {
            return res.redirect('/me/write_a_post/create');
        }

        if (!user.draft.includes(idDraft)) {
            return res.json({
                id: idDraft,
            });
        }

        const data = await mzFs.readFile(`${pathToDraftArticles}/${idDraft}.json`, 'utf8');
        res.json({
            id: idDraft,
            data: JSON.parse(data),
        })
    },
    draft: async (req, res) => {
        const user = await User.findById(req.user.id);
        if (!user.draft.includes(req.body.id)) {
            user.draft.push(req.body.id);
            await user.save();
        }
        const wr = fs.createWriteStream(`${pathToDraftArticles}/${req.body.id}.json`);
        wr.write(JSON.stringify(req.body.data));
        wr.end(null);

        wr.on('error', (err) => console.log(err));
        wr.on('finish', () => {
            res.send('OK');
        });
    },
    delete: async (req, res) => {
        const user = await User.findById(req.user.id);
        const idDraft = user.draft.includes(req.body.id);
        if (!idDraft) {
            req.flash('error', 'The draft isn\'t existed!');
            return res.status(400).send();
        }

        await mzFs.unlink(`${pathToDraftArticles}/${req.body.id}.json`);
        user.draft.splice(user.draft.findIndex((item) => item === req.body.id), 1);
        await user.save();
        req.flash('success', 'The draft was removed successfully');
        res.send();
    },
    publish: async (req, res) => {
        // let data = await mzFs.readFile(`${pathToDraftArticles}/${req.body.id}.json`, 'utf8');
        let data = req.body.data;

        const info = {
            title: data.find((item) => item.type === 'mainTitle').text,
            mainImg: data.find((item) => item.type === 'mainImg').src,
            summary: data.find((item) => item.type === 'par').text.slice(0, 158),
            content: new Buffer(JSON.stringify(data))
        }

        const newArticle = new Article(info);
        await newArticle.save();
        res.send();
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