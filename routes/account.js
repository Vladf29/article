'use strict'

const router = require('express-promise-router')();
const multer = require('multer');

const authorized = require('../modules/authorized');
const AccountControllers = require('../controllers/accounts');
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

router.get('/settings', authorized.isAuthorized, AccountControllers.pages.renderSettings);
router.get('/profile', authorized.isAuthorized, AccountControllers.pages.renderProfile);
router.get('/posts', authorized.isAuthorized, AccountControllers.pages.renderPosts);

router.get('/delete', AccountControllers.userDeleteAccount);

router.put('/update/email', validateBody(schemas.logIn), AccountControllers.updates.userEmail);
router.put('/update/username', validateBody(schemas.username), AccountControllers.updates.userUsername);
router.put('/update/password', validateBody(schemas.updataPassword), AccountControllers.updates.userPassword);

router.put('/update/name', AccountControllers.updates.userName);
router.put('/update/describe', AccountControllers.updates.userDescribe);
router.put('/update/aboutMe', AccountControllers.updates.userAboutMe);

router.put('/update/imgUrl', AccountControllers.updates.userAvatarUrl);
router.put('/update/avatarImg', uploadAvatar.single('img'), AccountControllers.updates.userAvatarImg);

module.exports = router;