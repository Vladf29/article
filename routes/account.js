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

router.use(authorized.isAuthorized);

router.get('/', AccountControllers.pages.renderProfile);
router.get('/settings', AccountControllers.pages.renderSettings);
router.get('/posts', AccountControllers.pages.renderPosts);

router.get('/likes', async (req, res) => {
    const User = require('../db/users');
    const user = await User.findById(req.user.id).populate('likes');
    res.render('me/posts', {
        owner: true,
        user,
        posts: user.likes,
        active:'likes'
    });
});

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