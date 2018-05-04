'use strict'

import {
    httpRequest
} from './modules/httpRequest';

$('.js-update-email').validate({
    rules: {
        email: {
            required: true,
            email: true
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    messages: {
        email: {
            email: "Your email address must be in the format of name@domain.com"
        }
    },
    errorClass: 'invalid',
    submitHandler: HandlerUpdateEmail
});

$('.js-update-password').validate({
    rules: {
        oldPassword: {
            required: true,
            minlength: 6
        },
        newPassword: {
            required: true,
            minlength: 6
        },
        confirmPassword: {
            required: true,
            minlength: 6,
            equalTo: "#newPassword"
        },
    },
    messages: {
        confirmPassword: {
            equalTo: 'Please enter new password again'
        }
    },
    errorClass: 'invalid',
    submitHandler: HandlerUpdatePassword
});

$('.js-update-username').validate({
    rules: {
        username: {
            required: true,
        },
        password: {
            required: true,
            minlength: 6
        }
    },
    errorClass: 'invalid',
    submitHandler: HandlerUpdateUsername
});

/** 
 * Isn't ready yet!!!
 */
async function HandlerUpdateEmail(form) {
    try {
        const data = {
            email: form.elements['email'].value,
            password: form.elements['password'].value
        }
        const opts = {
            url: '/test',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }

        const result = await httpRequest(opts);
        console.log(result);

    } catch (err) {
        console.log(err);
    }
}

async function HandlerUpdatePassword(form) {
    try {
        const data = {
            oldPassword: form.elements['oldPassword'].value,
            newPassword: form.elements['newPassword'].value
        }
        const opts = {
            url: '/test',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }

        const result = await httpRequest(opts);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

async function HandlerUpdateUsername(form) {
    try {
        const data = {
            username: form.elements['username'].value,
            password: form.elements['password'].value
        }
        const opts = {
            url: '/test',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }

        const result = await httpRequest(opts);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}

/**
 * 
 */