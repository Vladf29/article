'use strict'

import {
    httpRequest
} from './modules/httpRequest';

$(document.body).on('click', '.js-img', function () {
    const src = $(this).attr('src');
    const bigImg = $('.js-big-img');
    bigImg.find('.big-img img').attr('src', src);
    bigImg.attr('data-state', 'show');
});

$(document.body).on('click', '.js-big-img', function () {
    const bigImg = $(this);
    bigImg.find('.big-img img').attr('src', '');
    bigImg.attr('data-state', 'hidden');
});

// $(document.body).on('click', '.js-like', function () {
//     const likeElem = $(this);
//     const number = $(this).find('.js-number-likes');
//     const numbers = number.text() || 0;
//     number.empty();
//     if (likeElem.attr('data-liked') === 'true') {
//         likeElem.find('.js-icon-heart').removeClass('fas').addClass('far');
//         likeElem.attr('data-liked', 'false');
//         number.text(+numbers - 1);
//     } else {
//         likeElem.find('.js-icon-heart').removeClass('far').addClass('fas');
//         likeElem.attr('data-liked', 'true');
//         number.text(+numbers + 1);
//     }
// });

$(document.body).on('click', '.js-replay', function () {
    const repaly = $(this);
});

$(document.body).on('submit', '.js-add-comment', function () {
    const comment = $(this).find('.js-comment-control');
    if (!comment.val()) return;
    const temp = `
        <div class="comment js-comment" data-state="data-state">
            <div class="comment__delete js-comment-delete">
                <i class="fas fa-times"></i>
            </div>
            <div class="comment__c">
              <div class="comment__avatar"><img src="" alt=""></div>
              <div class="comment__body">
                <div class="comment__info"><a class="comment__name" href="#">Someone</a><span class="comment__timestamp">Time</span></div>
                <div class="comment__content">
                  <p>${comment.val()}</p>
                </div>
                <div class="comment__footer">
                  <div class="comment__like js-like">
                    <i class="far fa-heart js-icon-heart"></i>
                    <span class="comment__count js-number-heart">0</span>
                  </div>
                  <span class="replay js-replay">Repaly</span>
                </div>
              </div>
            </div>
            <div class="comment__children js-comment-children"></div>
        </div>
    `

    if ($(this).hasClass('js-add-comment-chilren')) {
        $(this).closest('.js-comment').attr('data-state', '');
        $(this).closest('.js-add-comment-c').replaceWith(temp);
    } else {
        $('.js-comments').prepend(temp);
    }
    return false;
});

$(document.body).on('click', '.js-replay', function () {
    const parent = $(this).closest('.js-comment');
    if (parent.attr('data-state') === 'edit') return;

    parent.attr('data-state', 'edit')
    const ch = parent.find('.js-comment-children').first();
    const temp = `
      <div class="comment no-border js-add-comment-c">
        <div class="comment__c">
          <div class="comment__avatar"><img src="" alt=""></div>
          <div class="comment__body">
            <form class="js-add-comment js-add-comment-chilren">                              
              <div class="comment__field">
                <textarea class="comment__control js-comment-control" placeholder="Leave a comment"></textarea>
              </div>
              <div class="comment__footer" style="justify-content: flex-end;">
                <button class="btn btn_primary">Submit</button>
              </div>
            </form>
          </div>
        </div>
    </div>
    `
    ch.prepend(temp);
});

$(document.body).on('click', '.js-comment-delete', function () {
    $(this).closest('.js-comment').remove();
});