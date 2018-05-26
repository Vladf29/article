'use strict'

const router = require('express-promise-router')();
const User = require('../db/users');
const Posts = require('../db/articles');

router.get('/', (req, res) => {
    res.redirect('/');
});

router.get('/:username', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).populate('articles', ['title']);

    if (!user) {
        req.flash('error', `User with the 'username' ${req.params.username} isn't exsited`);
        return res.redirect('/');
    }

    const owner = req.user && user.id === req.user.id;
    if (owner) return res.redirect('/me');

    res.render('me/aboutMe', {
        user,
        owner
    });
});

router.get('/:username/posts', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).populate('articles', ['title', 'mainImg', 'summary', 'author']);
    const posts = user.articles;
    if (!user) {
        req.flash('error', `User with the 'username' ${req.params.username} isn't exsited`);
        return res.redirect('/');
    }

    const owner = req.user && user.id === req.user.id;
    if (owner) return res.redirect('/me/posts');

    res.render('me/posts', {
        owner,
        user,
        posts,
        active: 'posts'
    });
});

router.get('/:username/likes', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).populate('likes');

    const owner = req.user && user.id === req.user.id;
    if (owner) return res.redirect('/me/likes');

    res.render('me/posts', {
        user,
        posts: user.likes,
        active: 'likes'
    });
});

module.exports = router;