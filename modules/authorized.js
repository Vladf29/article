'use strict'

module.exports = {
    isAuthorized: (req, res, next) => {
        if (req.user) return next();
        req.flash('error', 'Sorry, but you must be registered');
        res.redirect('/');
    },
    isNotAuthorized: (req, res, next) => {
        if (!req.user) return next()
        req.flash('error', 'Firstly you should log out');        
        res.redirect('/');
    }
}