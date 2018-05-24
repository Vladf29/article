'use strict'

const Posts = require('../db/articles');

const topic = 'Tutorials and Insights'
const topics = {
    js: {
        topic: `JavaScript ${topic}`,
        img: '/asset/img/icon-js.png'
    },
    react: {
        topic: `React ${topic}`,
        img: '/asset/img/icon-react.png'
    },
    nodejs: {
        topic: `Node.js ${topic}`,
        img: '/asset/img/icon-nodejs.png'
    },
    typescript: {
        topic: `TypeScript ${topic}`,
        img: '/asset/img/icon-typescript.png'
    }
}



module.exports = {
    javaScript: async (req, res) => {
        const posts = await Posts.find({
            topics: "javascript"
        }).populate('author', ['username', 'name', 'avatarUrl']);
        res.render('index', {
            posts,
            ...topics.js
        });
    },

    react: async (req, res) => {
        const posts = await Posts.find({
            topics: "react"
        }).populate('author', ['username', 'name', 'avatarUrl']);
        res.render('index', {
            posts,
            ...topics.react
        });
    },

    nodejs: async (req, res) => {
        const posts = await Posts.find({
            topics: "nodejs"
        }).populate('author', ['username', 'name', 'avatarUrl']);
        res.render('index', {
            posts,
            ...topics.nodejs
        });
    },

    typeScript: async (req, res) => {
        const posts = await Posts.find({
            topics: "typescript"
        }).populate('author', ['username', 'name', 'avatarUrl']);
        res.render('index', {
            posts,
            ...topics.typescript
        });
    },
}