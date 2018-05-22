'use strict'

const router = require('express-promise-router')();
const User = require('../db/users');
const Posts = require('../db/articles');

router.get('/', async (req, res) => {
    const posts = await Posts.find({}).populate('author', ['username', 'name', 'avatarUrl']);
    res.render('index', {
        posts,
        topic: "Tutorials and Insights"
    });
});

router.get('/:username', async (req, res) => {
    const user = await User.findOne({
        username: req.params.username
    });

    if (!user) {
        req.flash('error', `User with the 'username' ${req.params.username} isn't exsited`);
        return res.redirect('/');
    }

    let owner = req.user ? user.username === req.user.username : false;

    res.render('me/aboutMe', {
        user,
        owner
    });
});

module.exports = router;