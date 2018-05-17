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
    content: {
        type: Buffer,
        required: true
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Article = mongoose.model('article', articleSchema);

module.exports = Article;