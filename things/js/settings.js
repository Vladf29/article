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
    submitHandler: (form, event) => {
        event.preventDefault();

        const data = {
            email: form.elements['email'].value,
            password: form.elements['password'].value
        }
        const opts = {
            url: '/me/update/email',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }

        sendData(opts);
    }
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
    submitHandler: (form, event) => {
        event.preventDefault();

        const data = {
            oldPassword: form.elements['oldPassword'].value,
            newPassword: form.elements['newPassword'].value
        }
        const opts = {
            url: '/me/update/password',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }
        sendData(opts);
    }
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
    submitHandler: (form, event) => {
        event.preventDefault();

        const data = {
            username: form.elements['username'].value,
            password: form.elements['password'].value
        }
        const opts = {
            url: '/me/update/username',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(data)
        }

        sendData(opts);
    }
});

async function sendData(opts) {
    try {
        await httpRequest(opts);
        location.href = location.href;
    } catch (err) {
        console.log(err);
    }
}