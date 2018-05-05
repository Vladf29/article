'use strict'

const Joi = require('joi');

module.exports = {
    validateParam: (schame, param) => {
        return (req, res, next) => {
            const result = Joi.validate({
                param: req.body[param]
            }, schame);
            if (result.error) return res.status(400).send('Something went wrong');

            if (!req.value) req.value = {};
            if (!req.value[param]) req.value[param] = {};

            req.value[param] = req.body[param];
            next();
        }
    },
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
            name: Joi.string().required(),
            password: Joi.string().min(6).required(),
            email: Joi.string().email().required()
        }),
        logIn: Joi.object().keys({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        }),
        username: Joi.object().keys({
            username: Joi.string().required(),
            password: Joi.string().min(6).required(),
        }),
        validStr: Joi.object().keys({
            param: Joi.string()
        }),
        updataPassword: Joi.object().keys({
            oldPassword: Joi.string().min(6).required(),
            newPassword: Joi.string().min(6).required(),
        })
    }
}