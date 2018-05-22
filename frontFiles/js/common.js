'use strict'

import {
    logInForm,
    signUpForm
} from './modules/signForm'


window.addEventListener('load', () => {
    logInForm();
    signUpForm();

    $('.aut__item[data-sign-toggle]').click(function () {
        const signToggle = $(this).attr('data-sign-toggle');
        $('.sign-c').addClass('sign-c_show').attr('data-state', signToggle);
        $(`.sign-c .${signToggle}`).find('.sign__control:first').focus();
    });

    $('.sign__close').click(function () {
        $('.sign-c').removeClass('sign-c_show').attr('data-state', '');
    });

    $('.js-avatar-log').click(function () {
        const state = $(this).closest('.avatar').attr('data-state');
        $(this).closest('.avatar').attr('data-state', state === 'open' ? 'closed' : 'open');
    });

    $('.js-search-icon').click(function () {
        const state = $(this).closest('.search').attr('data-state');
        $(this).closest('.search').attr('data-state', state === 'open' ? 'closed' : 'open');
        $(this).closest('.search').find('.search__control').val('').focus();
    });

    $('.js-flash-close').click(function () {
        $(this).closest('.flash-msg').remove();
    });
})