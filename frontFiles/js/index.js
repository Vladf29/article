'use strict'

$(document.body).on('click', '.js-like', function () {
    const likeElem = $(this);
    const idPost = $(this).attr('data-post-id');
    if (!idPost) return;

    const numberField = $(this).find('.js-number-likes');
    const numberLikes = numberField.text() || 0;
    
    $.ajax({
        method: 'POST',
        url: `/posts/like`,
        contentType: 'application/json',
        data: JSON.stringify({
            idPost
        }),
        success: function (data) {
            if (data.status === 'OK') {
                if (likeElem.attr('data-liked') === 'true') {
                    likeElem.find('.js-icon-heart').removeClass('fas').addClass('far');
                    likeElem.attr('data-liked', 'false');
                    numberField.text(+numberLikes - 1);
                } else {

                    likeElem.find('.js-icon-heart').removeClass('far').addClass('fas');
                    likeElem.attr('data-liked', 'true');
                    numberField.text(+numberLikes + 1);
                }
            }
        }

    });
});