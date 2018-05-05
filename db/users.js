'use strict'

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String,
        default: 'https://www.gravatar.com/avatar/eece7547006bb22bca41841eb40cb4b1?d=mm&s=200'
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