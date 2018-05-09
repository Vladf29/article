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

router.route('/settings')
    .get(authorized.isAuthorized, UserControllers.pages.renderSettings);

router.route('/profile')
    .get(authorized.isAuthorized, UserControllers.pages.renderProfile);

router.get('/write_post', UserControllers.pages.writePost);

router.get('/write_post/create', UserControllers.writePost.create);
router.post('/write_post/add', UserControllers.writePost.add);

router.get('/delete', UserControllers.userDeleteAccount);

router.put('/update/email', validateBody(schemas.logIn), UserControllers.updates.userEmail);
router.put('/update/username', validateBody(schemas.username), UserControllers.updates.userUsername);
router.put('/update/password', validateBody(schemas.updataPassword), UserControllers.updates.userPassword);

router.put('/update/name', UserControllers.updates.userName);
router.put('/update/describe', UserControllers.updates.userDescribe);
router.put('/update/aboutMe', UserControllers.updates.userAboutMe);

router.put('/update/imgUrl', UserControllers.updates.userAvatarUrl);
router.put('/update/avatarImg', uploadAvatar.single('img'), UserControllers.updates.userAvatarImg);

module.exports = router;