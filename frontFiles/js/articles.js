'use strict'

$('.js-delete').click(function () {
    const parent = $(this).closest('.story');
    if (confirm('Are you sure?')) parent.remove();
});

$('.js-tabs .tab').click(function () {
    $('.tab').removeClass('tab_selected');
    $(this).addClass('tab_selected');
});