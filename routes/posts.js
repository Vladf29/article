'use strict'

const router = require('express-promise-router')();

const postsControllers = require('../controllers/posts');
const authorized = require('../modules/authorized');

router.use('/write_a_post', authorized.isAuthorized);

router.use('/edit', authorized.isAuthorized);
router.use('/edit/post/:idPost', (req, res, next) => {
    res.cookie('idPost', req.params.idPost, {
        path: '/posts/edit/'
    });
    next();
});

router.get('/post/:idPost', postsControllers.renderPost);
router.post('/post/addComment', authorized.isAuthorized, postsControllers.addComment);
router.delete('/post/deleteComment', authorized.isAuthorized, postsControllers.deleteComment)

router.post('/like', authorized.isAuthorized, postsControllers.likePost);

router.get('/edit/post/:idPost', postsControllers.editPost);
router.get('/edit/downloadPost', postsControllers.editPostFunc.downloadPost);
router.post('/edit/savePost', postsControllers.editPostFunc.savePost);
router.delete('/edit/deletePost', postsControllers.editPostFunc.deletePost);


router.get('/write_a_post', postsControllers.writePost);
router.get('/write_a_post/downloadDraft', postsControllers.writePostFunc.downloadDraft);
router.post('/write_a_post/saveDraft', postsControllers.writePostFunc.saveDraft);
router.post('/write_a_post/publish', postsControllers.writePostFunc.publish);
router.delete('/write_a_post/deleteDraft', postsControllers.writePostFunc.deleteDraft);


module.exports = router;