'use strict'

const passport = require('passport');
const router = require('express-promise-router')();

const FormControllers = require('../controllers/forms');
const authenticate = require('../modules/authorized');

const {
    schemas,
    validateBody
} = require('../helpers/validator');

router.route('/sign_up')
    .post(validateBody(schemas.signUp), FormControllers.signUpUser);

router.route('/log_in')
    .post(validateBody(schemas.logIn), passport.authenticate('local'), FormControllers.logInUser);

router.get('/log_out', authenticate.isAuthorized, (req, res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/verify/:tokenConfirmEmail', FormControllers.verifyEmail);

module.exports = router;