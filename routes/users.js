'use strict'

const router = require('express-promise-router')();
const multer = require('multer');

const authorized = require('../modules/authorized');
const UserControllers = require('../controllers/users');
const {
    schemas,
    validateBody,
    validateParam
} = require('../helpers/validator');
const User = require('../db/users');

const uploadAvatar = multer({
    dest: './asset/users/avatars'
});

router.get('/users', async (req, res) => {
    const found = await User.find({});
    res.json(found);
});

router.get('/settings', authorized.isAuthorized, UserControllers.pages.renderSettings);
router.get('/profile', authorized.isAuthorized, UserControllers.pages.renderProfile);
router.get('/posts', authorized.isAuthorized, UserControllers.pages.renderPosts);

router.get('/delete', UserControllers.userDeleteAccount);

router.get('/write_a_post', authorized.isAuthorized, UserControllers.pages.writePost);

router.get('/write_a_post/create', UserControllers.writePost.create);
router.get('/write_a_post/download_draft',UserControllers.writePost.downloadDraft)
router.post('/write_a_post/draft', UserControllers.writePost.draft);
router.delete('/write_a_post/delete', UserControllers.writePost.delete);


router.put('/update/email', validateBody(schemas.logIn), UserControllers.updates.userEmail);
router.put('/update/username', validateBody(schemas.username), UserControllers.updates.userUsername);
router.put('/update/password', validateBody(schemas.updataPassword), UserControllers.updates.userPassword);

router.put('/update/name', UserControllers.updates.userName);
router.put('/update/describe', UserControllers.updates.userDescribe);
router.put('/update/aboutMe', UserControllers.updates.userAboutMe);

router.put('/update/imgUrl', UserControllers.updates.userAvatarUrl);
router.put('/update/avatarImg', uploadAvatar.single('img'), UserControllers.updates.userAvatarImg);

module.exports = router;