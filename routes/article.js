'use strict'

const router = require('express-promise-router')();
const fs = require('fs');

router.get('/', (req, res) => {
    res.render('article');
});

router.get('/a', (req, res) => {
    fs.readFile('./asset/articles/test.json', (err, data) => {
        data = data.toString();
        data = JSON.parse(data);
        res.send(data);
    });
});

router.post('/add', (req, res) => {
    const wr = fs.createWriteStream('./asset/articles/test.json');
    wr.write(JSON.stringify(req.body));
    res.send();
});

router.post('/add/comment', (req, res) => {

});

module.exports = router;