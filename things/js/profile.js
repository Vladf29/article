'use strict'

import {
    httpRequest
} from './modules/httpRequest'

$('.js-avatar').click(function () {
    $('.js-upload').attr('data-state', 'show')
});

$('.js-upload-close').click(function () {
    $('.js-upload').attr('data-state', 'hidden');
});

$('.js-upload-sidebar[data-show]').click(function (event) {
    const uploadShow = $(this).attr('data-show');
    $('.js-upload-sidebar[data-show]').removeClass('upload-img__sidebar-item--active');
    $(this).addClass('upload-img__sidebar-item--active')
    $(`.js-upload-content[data-type]`).attr('data-state', 'hidden');
    $(`.js-upload-content[data-type=${uploadShow}]`).attr('data-state', 'show');
});

document.getElementById('userImg').addEventListener('change', function () {
    const file = this.files[0];

    const elemPreview = $('.js-preview');
    $('.js-select').closest('.js-upload-content').attr('data-state', 'hidden');
    elemPreview.attr('data-state', 'show');
    elemPreview.attr('data-show', 'laptop')

    const img = document.createElement('img');
    img.file = file;
    elemPreview.find('.preview-c').append(img);

    const reader = new FileReader();
    reader.onload = (function (aImg) {
        return function (e) {
            aImg.src = e.target.result
        }
    })(img);
    reader.readAsDataURL(file);
});

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

$('.js-upload-form-url').submit(function (event) {
    event.preventDefault();
    const url = $('#userURLImg').val();
    if (url === '') return;

    const elemPreview = $('.js-preview');
    $(this).closest('.js-upload-content').attr('data-state', 'hidden');
    elemPreview.attr('data-state', 'show');
    elemPreview.attr('data-show', 'link')

    elemPreview.find('.preview-c').append(`<img src='${url}'>`);
});

/*
 * Isn't ready yet!!!!
 */
async function sendImg() {
    try {
        const img = document.getElementById('userImg');
        if (img.value === '') return;

        const formData = new FormData();
        formData.append('img', img.files[0]);
        const opts = {
            url: '/test',
            method: 'PUT',
            data: formData,
        }
        const result = await httpRequest(opts);
        console.log(result);

    } catch (err) {
        console.log(err);
    }
}


async function sendUrlImg(event) {
    try {
        const url = $('#userURLImg').val();
        if (url === '') return;

        const opts = {
            url: '/test',
            method: 'PUT',
            header: ['Content-Type', 'application/json'],
            data: JSON.stringify({
                url
            })
        }

        const result = await httpRequest(opts);
        console.log(result);
    } catch (err) {
        console.log(err);
    }
}
/**
 * !!!!
 */