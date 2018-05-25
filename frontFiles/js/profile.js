'use strict'

import {
    httpRequest
} from './modules/httpRequest';
import uploadImg from './modules/uploadImg';

$('.js-avatar').click(function () {
    $('.js-upload').attr('data-state', 'show')
});

uploadImg();

$('.js-preview-action').on('click', '.btn', function () {
    const action = $(this).attr('data-action');
    switch (action) {
        case 'cancel':
            $('.js-preview').attr('data-state', 'hidden').find('.preview-c img').remove();
            $(`.js-upload-content[data-type=${$('.js-preview').attr('data-show')}]`).attr('data-state', 'show');

            if ($('.js-preview').attr('data-show') === 'laptop') {
                $('#userImg').val('');
            } else {
                $('#userURLImg').val('');
            }

            break;
        case 'save':
            if ($('.js-preview').attr('data-show') === 'laptop') {
                sendImg();
            } else {
                sendUrlImg();
            }
            break;
        default:
            break;
    }
});

$('.js-data-edit').on('change', async function () {
    try {
        const edit = $(this).attr('data-edit');
        const val = $(this).val();
        if (edit === 'name' && !val) return;

        const obj = {}
        obj[edit] = val;

        const opts = {
            url: `/me/update/${edit}`,
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify(obj)
        }

        await httpRequest(opts);
    } catch (err) {
        console.log(err);
    }
});

$('.js-edit-btn').click(function () {
    const ok = $(this).closest('.user-profile__c').find('.about-block .about-block__c[data-action=ok]');
    const edit = $(this).closest('.user-profile__c').find('.about-block .about-block__c[data-action=edit]');

    const val = ok.find('p').text();
    edit.find('textarea').val(val);
    ok.attr('data-state', 'hidden');
    edit.attr('data-state', 'show');

    $(this).attr('data-state', 'hidden');
    $('.js-edit-btn-ok').attr('data-state', 'show');

    edit.find('textarea').focus();
});

$('.js-edit-btn-ok').click(function () {
    const ok = $(this).closest('.user-profile__c').find('.about-block .about-block__c[data-action=ok]');
    const edit = $(this).closest('.user-profile__c').find('.about-block .about-block__c[data-action=edit]');

    const val = edit.find('textarea').val();
    ok.find('p').text(val);
    edit.attr('data-state', 'hidden');
    ok.attr('data-state', 'show');

    $('.js-edit-btn').attr('data-state', 'show');
    $(this).attr('data-state', 'hidden');

    sendAboutMe(val);
});

/*
 * Isn't ready yet!!!!
 */

async function sendAboutMe(val) {
    try {
        const opts = {
            url: '/me/update/aboutMe',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify({
                aboutMe: val
            })
        }

        await httpRequest(opts);
    } catch (err) {
        console.log(err);
    }
}

async function sendImg() {
    try {
        const img = document.getElementById('userImg');
        // if (img.value === '') return;

        const formData = new FormData();
        formData.append('img', img.files[0]);
        const opts = {
            url: '/me/update/avatarImg',
            method: 'PUT',
            data: formData,
        }
        await httpRequest(opts);
        location.href = location.href;
    } catch (err) {
        console.log(err);
    }
}

async function sendUrlImg(event) {
    try {
        const url = $('#userURLImg').val();
        // if (url === '') return;

        const opts = {
            url: '/me/update/imgUrl',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify({
                url
            })
        }

        await httpRequest(opts);
        location.href = location.href;
    } catch (err) {
        console.log(err);
    }
}
/**
 * !!!!
 */