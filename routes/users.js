'use strict'

const router = require('express-promise-router')();
const User = require('../db/users');
const Posts = require('../db/articles');

router.get('/:username', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    });

    if (!user) {
        req.flash('error', `User with the 'username' ${req.params.username} isn't exsited`);
        return res.redirect('/');
    }

    let owner = req.user ? user.id === req.user.id : false;
    if (owner) return res.redirect('/me/profile');

    res.render('me/aboutMe', {
        user,
        owner
    });
});

router.get('/:username/posts', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    }).populate('articles', ['title', 'mainMain', 'summary'])
    const posts = user.articles;
    if (!user) {
        req.flash('error', `User with the 'username' ${req.params.username} isn't exsited`);
        return res.redirect('/');
    }

    let owner = req.user ? user.id === req.user.id : false;
    if (owner) return res.redirect('/me/posts');
    
    res.render('me/posts', {
        owner,
        user,
        posts
    });
});

module.exports = router;