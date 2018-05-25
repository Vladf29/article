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

module.exports = router;