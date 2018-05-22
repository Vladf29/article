'use strict'

export const _checkType = (elem) => {
    return Object.prototype.toString.call(elem).slice(8, -1);
}

export const _toggleState = (elem, one, two) => {
    if (!elem || !one || !two) return;
    if (_checkType(elem) === 'String')
        elem = document.querySelector(elem);

    elem.setAttribute('data-state', elem.getAttribute('data-state') === one ? two : one);
}

export const _hasClass = (elem, cls) => {
    if (!elem || !cls) return;
    return elem.classList.contains(cls);
}

export const _addClass = (elem, ...cls) => {
    if (!elem || [...cls].length === 0) return;
    elem.classList.add(...cls);
}