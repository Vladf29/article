'use strict'
export default () => {
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
}