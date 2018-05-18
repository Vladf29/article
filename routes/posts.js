'use strict'

const router = require('express-promise-router')();

const postsControllers = require('../controllers/posts');
const authorized = require('../modules/authorized');

router.use('/edit/:idPost', (req, res, next) => {
    res.cookie('idPost', req.params.idPost, {
        path: '/posts/edit'
    });
    next();
})

router.get('/', (req, res) => {
    res.render('article');
});

router.get('/post/:idPost', postsControllers.renderPost);

router.get('/edit/:idPost', authorized.isAuthorized, postsControllers.editPost);

module.exports = router;