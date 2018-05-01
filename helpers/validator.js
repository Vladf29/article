'use strict'

const Joi = require('joi');

module.exports = {
    validateBody: (schame) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schame);
            if (result.error) return res.status(400).send('Something went wrong');

            if (!req.value) req.value = {};
            if (!req.value.body) req.value.body = {};

            req.value.body = req.body;
            next();
        }
    },
    schemas: {
        signUp: Joi.object().keys({
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            password: Joi.string().min(6).required(),
            email: Joi.string().email().required()
        }),
        logIn: Joi.object().keys({
            email: Joi.string().required(),
            password: Joi.string().min(6).required()
        })
    }
}