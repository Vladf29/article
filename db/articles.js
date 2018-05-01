'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    liked: [{
        type: Schema.Types.ObjectId,
        ref: 'user'
    }],
    content: String
});

const Article = mongoose.model('article', articleSchema);

module.exports = Article;