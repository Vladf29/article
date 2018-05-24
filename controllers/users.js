'use strict'

const fs = require('fs');
const mzFs = require('mz/fs');

const User = require('../db/users');
const Article = require('../db/articles');

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
        const user = await User.findById(req.user.id).populate('articles');

        res.render('me/posts', {
            owner: true,
            user,
            posts: user.articles
        });
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
    downloadPost: async (req, res) => {
        const idPost = req.query.post;
        if (!idPost) return res.status(400).send('Bad Request');

        const post = await Article.findById(idPost);
        if (!post) return res.status(404).send('The post wasn\'t found');

        res.json({
            data: JSON.parse(post.content.toString())
        });
    },
    downloadDraft: async (req, res) => {
        const user = await User.findById(req.user.id);
        const DrafPostId = req.query.post
        if (!DrafPostId) return res.status(404).send('Not Found');

        const isTaken = user.draftArticles.id(DrafPostId);
        if (!isTaken) {
            res.clearCookie('DrafPostId', {
                path: '/me/write_a_post'
            });
            return res.status(400).send('Maybe the draft is removed.')
        };

        res.cookie('DrafPostId', isTaken.id, {
            path: '/me/write_a_post'
        });
        res.json({
            id: isTaken.id,
            data: JSON.parse(isTaken.content.toString())
        });
    },
    draft: async (req, res) => {
        const user = await User.findById(req.user.id);
        console.log(req.user.id)
        const isTaken = user.draftArticles.id(req.body.id);
        if (!isTaken) {
            user.draftArticles.push({
                content: new Buffer(JSON.stringify(req.body.data))
            });

            await user.save();
            const DrafPostId = user.draftArticles[user.draftArticles.length - 1].id;
            res.cookie('DrafPostId', DrafPostId, {
                path: '/me/write_a_post'
            })
            return res.json({
                id: DrafPostId
            });
        }

        isTaken.content = new Buffer(JSON.stringify(req.body.data));
        await user.save();

        res.cookie('DrafPostId', isTaken.id, {
            path: '/me/write_a_post'
        });
        res.json({
            id: req.body.id
        });
    },
    delete: async (req, res) => {
        const user = await User.findById(req.user.id);
        res.clearCookie('DrafPostId', {
            path: '/me/write_a_post'
        });

        const isTaken = user.draftArticles.id(req.body.id);
        if (!isTaken) {
            req.flash('error', 'The draft isn\'t existed!');
            return res.status(404).send();
        }

        isTaken.remove();
        await user.save();
        res.send('OK');
    },
    publish: async (req, res) => {
        let data = req.body.data;

        const preContent = {
            title: data.find((item) => item.type === 'mainTitle'),
            mainImg: data.find((item) => item.type === 'mainImg'),
        }

        const content = {
            content: new Buffer(JSON.stringify(data)),
            author: req.user.id,
            topics: ['JavaScript', 'Node.js', 'React', 'TypeScript']
        }

        if (!preContent.title) {
            req.flash('error', `Oh! Something went wrong:( You forgot to add title for the article.`);
            return res.status(400).send();
        }

        content.title = preContent.title.text;

        if (preContent.mainImg) content.mainImg = preContent.mainImg.src;

        const summary = data.find((item) => item.type === 'par');
        content.summary = summary ? summary.text.slice(0, 155) : '...';

        const newArticle = new Article(content);
        await newArticle.save();

        const user = await User.findById(req.user.id);
        user.articles.push(newArticle.id);
        await user.save();

        res.clearCookie('DrafPostId', {
            path: '/me/write_a_post'
        });
        req.flash('success', `The post was successfully publish.`);
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
            await mzFs.unlink('./' + currentImg)
        }

        await user.remove();
        res.send('Ok');
    }
}