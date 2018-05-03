'use strict'

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    articles: [{
        type: Schema.Types.ObjectId,
        ref: 'article'
    }],
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'article'
    }],
    describe: String,
    aboutMe: String,
    emailActive: {
        type: Boolean,
        default: false
    },
    tokenConfirmEmail: String,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const User = mongoose.model('user', userSchema);
module.exports = User;

module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        throw new Error('Hashing Error', err);
    }
}

module.exports.comparePassword = async (inputP, hashP) => {
    try {
        return await bcrypt.compare(inputP, hashP);
    } catch (err) {
        return new Error('Comparing failed', err);
    }
}