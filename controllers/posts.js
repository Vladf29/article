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
    },

    likePost: async (req, res) => {
        const idPost = req.body.idPost;
        if (!idPost) return res.status(400).send('Sorry but id the post was missing.');

        const userId = req.user.id;
        if (!userId) return res.status(401).send('Sorry but you are not authorized.');

        const [post, user] = await Promise.all([Posts.findById(idPost), User.findById(userId)]);


        if (user.likes.indexOf(idPost) !== -1) {
            post.likes.pull(user.id);
            user.likes.pull(post.id);
        } else {
            post.likes.push(user.id);
            user.likes.push(post.id)
        }

        await Promise.all([post.save(), user.save()])

        res.json({
            status: "OK"
        });
    }
}