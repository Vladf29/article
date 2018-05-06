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

userSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(this.password, salt);
        this.password = passwordHash;
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (err) {
        return new Error('Comparing failed', err);
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;