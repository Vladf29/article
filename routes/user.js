'use strict'

const router = require('express-promise-router')();

const authorized = require('../modules/authorized');

const {
    schames,
    validateBody
} = require('../helpers/validator');

const User = require('../db/users');

router.get('/', async (req, res) => {
    const found = await User.find({});
    res.json(found);
});
router.route('/bookmarks')
    .get(authorized.isAuthorized, (req, res) => {
        res.render('me/bookmarks')
    });

module.exports = router;