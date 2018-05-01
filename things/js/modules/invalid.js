export const resetInvalid = () => {
    [].forEach.call(document.querySelectorAll('.sign__group[data-valid=invalid]'), (item) => {
        item.setAttribute('data-valid', 'valid');
        item.firstElementChild.textContent = '';
    });
}

export const makeInvalid = (msg = '') => {
    [].forEach.call(document.querySelectorAll('.sign__group[data-valid]'), (item) => {
        item.setAttribute('data-valid', 'invalid');
    });
    // document.querySelector('.sign__group[data-state]').firstElementChild.textContent = msg;
}