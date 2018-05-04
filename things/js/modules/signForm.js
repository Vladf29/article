'use strict'
import {
    resetInvalid,
    makeInvalid
} from './invalid';
import {
    httpRequest
} from './httpRequest';

export const signUpForm = () => {
    const form = document.querySelector('.js-sign-form');

    form.addEventListener('submit', handlerSignUp)

    async function handlerSignUp(event) {
        event.preventDefault();
        const personData = {
            username: this.elements['username'].value,
            email: this.elements['email'].value,
            password: this.elements['password'].value
        }

        const schema = {
            username: {
                presence: {
                    allowEmpty: false,
                },
            },
            email: {
                presence: {
                    allowEmpty: false,
                },
                email: true
            },
            password: {
                presence: {
                    allowEmpty: false,
                },
                length: {
                    minimum: 6,
                    message: `must be at least 6 characters`
                }
            },
            'Reapet password': {
                equality: "password"
            }
        }

        resetInvalid();

        const rePassword = this.elements['Reapet password'].value;
        const notValid = validate({
            username: personData.username,
            email: personData.email,
            password: personData.password,
            'Reapet password': rePassword
        }, schema);

        if (notValid) {
            for (const key in notValid) {
                const parent = $(this.elements[key]).parent();
                parent.attr('data-valid', 'invalid');
                parent.find('.sign__msg-invlaid').text(notValid[key][0])
            }
            return;
        }

        try {
            const settings = {
                method: 'POST',
                url: '/form/sign_up',
                header: ['Content-Type', 'application/json'],
                data: JSON.stringify(personData)
            }
            await httpRequest(settings);
            location.href = location.href;
        } catch (err) {
            if (err.status) {
                const parent = $(this.elements['name']).parent();
                parent.attr('data-valid', 'invalid');
                parent.find('.sign__msg-invlaid').text(err.message);
                makeInvalid();
                return;
            }
            console.log(err.message);
        }
    }
}

export const logInForm = () => {
    const logForm = document.querySelector('.js-log-form');

    logForm.addEventListener('submit', handlerLogIn);

    async function handlerLogIn(event) {
        event.preventDefault();
        const personData = {
            email: this.elements['email'].value,
            password: this.elements['password'].value
        }

        const schema = {
            email: {
                presence: {
                    allowEmpty: false,
                },
                email: true
            },
            password: {
                presence: {
                    allowEmpty: false,
                },
                length: {
                    minimum: 6,
                    message: `must be at least 6 characters`
                }
            },
        }

        resetInvalid();

        const notValid = validate({
            email: personData.email,
            password: personData.password,
        }, schema);

        if (notValid) {
            for (const key in notValid) {
                const parent = $(this.elements[key]).parent();
                parent.attr('data-valid', 'invalid');
                parent.find('.sign__msg-invlaid').text(notValid[key][0])
            }
            return;
        }

        try {
            const settings = {
                method: 'POST',
                url: '/form/log_in',
                header: ['Content-Type', 'application/json'],
                data: JSON.stringify(personData)
            }
            await httpRequest(settings);
            location.href = location.href;
        } catch (err) {
            if (err.status) {
                const parent = $(this.elements['email']).parent();
                parent.attr('data-valid', 'invalid');
                parent.find('.sign__msg-invlaid').text(err.message);
                makeInvalid();
                return;
            }
            console.log(err.message);
        }
    }
}