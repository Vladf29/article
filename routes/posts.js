'use strict'

const router = require('express-promise-router')();

const postsControllers = require('../controllers/posts');
const authorized = require('../modules/authorized');

router.use('/edit/:idPost', (req, res, next) => {
    res.cookie('idPost', req.params.idPost, {
        path: '/posts/edit'
    });
    next();
});

router.get('/post/:idPost', postsControllers.renderPost);

router.get('/edit/:idPost', authorized.isAuthorized, postsControllers.editPost);

router.post('/like', authorized.isAuthorized, postsControllers.likePost);

module.exports = router;