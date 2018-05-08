'use strict'

const router = require('express-promise-router')();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('article');
});

module.exports = router;