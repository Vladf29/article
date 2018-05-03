'use strict'

$('.js-edit-btn').click(function () {
    const dataAttr = '.' + $(this).attr('data-target-field');
    if (($(dataAttr)).attr('disabled')) {
        $(dataAttr).removeAttr('disabled').focus();
    } else {
        $(dataAttr).attr('disabled', 'disabled').focusout();
    }
});