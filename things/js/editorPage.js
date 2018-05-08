'use strict'

import {
    uploadImg
} from './modules/uploadImg';

import {
    Editor
} from './modules/editor';

const editor = new Editor();
editor.Start();

uploadImg();

// $(document.body).on('click', '.js-block-img', function () {
//     $('.js-upload').attr('data-state', 'show');
// });

$(document.body).on('click', '.js-block-delete', function (event) {
    event.stopPropagation();
    $(this).closest('.block-img').remove();
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
                editor.AddBlockImg();
            } else {
                editor.AddBlockImg($('#userURLImg').val());
            }
            break;
        default:
            break;
    }
});