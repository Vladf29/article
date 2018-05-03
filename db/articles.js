'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    title: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: [{
        author: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        comment: String,
        data: Date
    }],
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    content: String
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Article = mongoose.model('article', articleSchema);

module.exports = Article;