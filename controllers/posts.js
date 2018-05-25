'use strict'

// It's the same as articles
const Posts = require('../db/articles');
const User = require('../db/users');

const pathsCookie = {
    writePost: 'posts/write_a_post',
    editPost: 'posts/edit/'
}

const editPostFunc = {
    downloadPost: async (req, res) => {
        const idPost = req.cookies['idPost'];
        if (!idPost) {
            req.flash('error', 'Sorry but the post might not exist.');
            return res.redirect('/posts/write_a_post');
        };

        const post = await Posts.findById(idPost);
        if (!post) return res.status(404).send('The post wasn\'t found');

        res.json({
            data: JSON.parse(post.content.toString())
        });
    },
    savePost: async (req, res) => {
        const data = req.body.data;
        const idPost = req.cookies['idPost'];
        if (!idPost) return res.status(404).send('Not Found!');

        const preContent = {
            title: data.find((item) => item.type === 'mainTitle'),
            mainImg: data.find((item) => item.type === 'mainImg'),
        }

        const content = {
            content: new Buffer(JSON.stringify(data)),
            // topics: ['JavaScript', 'Node.js', 'React', 'TypeScript']
        }

        if (!preContent.title) {
            req.flash('error', `Oh! Something went wrong:( You forgot to add title for the article.`);
            return res.status(400).send();
        }

        content.title = preContent.title.text;

        if (preContent.mainImg) content.mainImg = preContent.mainImg.src;

        const summary = data.find((item) => item.type === 'par');
        content.summary = summary ? summary.text.slice(0, 155) : '...';

        const post = await Posts.findById(idPost);

        post.summary = content.summary;
        post.mainImg = content.mainImg;
        post.title = content.title;
        post.content = content.content;

        await post.save();

        res.clearCookie('idPost', {
            path: pathsCookie.editPost
        });
        // req.flash('success', `The post was successfully upateded.`);
        res.send();
    },
}

const writePostFunc = {
    downloadDraft: async (req, res) => {
        const user = await User.findById(req.user.id);
        const DrafPostId = req.cookies['DrafPostId'];
        if (!DrafPostId) return res.status(404).send('Not Found');

        const isTaken = user.draftArticles.id(DrafPostId);
        if (!isTaken) {
            res.clearCookie('DrafPostId', {
                path: pathsCookie.writePost
            });
            return res.status(404).send('Maybe the draft is removed.')
        };

        res.cookie('DrafPostId', isTaken.id, {
            path: pathsCookie.writePost
        });
        res.json({
            id: isTaken.id,
            data: JSON.parse(isTaken.content.toString())
        });
    },
    saveDraft: async (req, res) => {
        const user = await User.findById(req.user.id);
        const DrafPostIdCookie = req.cookies['DrafPostId'];

        const isTaken = user.draftArticles.id(DrafPostIdCookie);
        if (!isTaken) {
            user.draftArticles.push({
                content: new Buffer(JSON.stringify(req.body.data))
            });

            await user.save();
            const DrafPostId = user.draftArticles[user.draftArticles.length - 1].id;
            res.cookie('DrafPostId', DrafPostId, {
                path: pathsCookie.writePost
            })
            return res.json({
                id: DrafPostId
            });
        }

        isTaken.content = new Buffer(JSON.stringify(req.body.data));
        await user.save();

        res.cookie('DrafPostId', isTaken.id, {
            path: pathsCookies.writePost
        });
        res.json({
            id: req.body.id
        });
    },
    deleteDraft: async (req, res) => {
        const user = await User.findById(req.user.id);
        const DrafPostIdCookie = req.cookies['DrafPostId'];
        if (!DrafPostIdCookie) return res.status(404).send('Not Found!');

        res.clearCookie('DrafPostId', {
            path: pathsCookie.writePost
        });

        const isTaken = user.draftArticles.id(DrafPostIdCookie);
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
        const DrafPostIdCookie = req.cookies['DrafPostId'];

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

        const newPost = new Posts(content);
        await newPost.save();

        const user = await User.findById(req.user.id);
        user.articles.push(newPost.id);
        if (DrafPostIdCookie) user.draftArticles.pull(DrafPostIdCookie);

        await user.save();

        res.clearCookie('DrafPostId', {
            path: pathsCookie.writePost
        });
        req.flash('success', `The post was successfully publish.`);
        res.json({
            id: newPost.ids
        });
    }
}

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
    },

    writePost: (req, res) => {
        res.render('editor');
    },
    writePostFunc,
    editPostFunc
}