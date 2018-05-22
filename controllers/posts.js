'use strict'

// It's the same as articles
const Posts = require('../db/articles');
const User = require('../db/users');

module.exports = {
    renderPost: async (req, res) => {
        const post = await Posts.findById(req.params.idPost).populate('author', ['name', 'avatarUrl', 'username']);
        let owner = false;

        if (req.user) {
            owner = req.user.id === post.author.id;
        }

        res.render('article', {
            owner,
            post,
            content: JSON.parse(post.content.toString())
        });
        // res.json(JSON.parse(post.content.toString()))
    },

    editPost: async (req, res) => {
        const idPost = req.params.idPost;
        res.render('editor', {
            type: 'public'
        });
    }
}