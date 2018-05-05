'use strict'

const router = require('express-promise-router')();

const authorized = require('../modules/authorized');

const UserControllers = require('../controllers/users');
const {
    schemas,
    validateBody,
    validateParam
} = require('../helpers/validator');

const User = require('../db/users');

router.get('/', async (req, res) => {
    const found = await User.find({});
    res.json(found);
});

router.route('/profile')
    .get(authorized.isAuthorized, UserControllers.renderProfilePage);

router.route('/settings')
    .get(authorized.isAuthorized, UserControllers.renderSettingsPage);

router.put('/update/email', validateBody(schemas.logIn), UserControllers.updateUserEmail);
router.put('/update/username', validateBody(schemas.username), UserControllers.updateUserUsername);
router.put('/update/password', validateBody(schemas.updataPassword), UserControllers.updateUserPassword);
router.put('/update/name', UserControllers.updateUserName);
router.put('/update/describe', UserControllers.updateUserDescribe);
router.put('/update/aboutMe', UserControllers.updateUserAboutMe);

module.exports = router;