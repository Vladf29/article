'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    mainImg: String,
    summary: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        comment: String,
        data: Date
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    topics: [{
        type: String,
        lowercase: true
    }],
    content: {
        type: Buffer,
        required: true
    },
    dataPublish: {
        type: String,
        default: new Date(),
    },
    dataLastUpdate: {
        type: String,
        default: new Date(),
    }
});

const Article = mongoose.model('article', articleSchema);

module.exports = Article;