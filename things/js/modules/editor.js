'use strict'

export const Editor = (() => {
    const _articleBlock = document.querySelector('.js-article');
    const _editPanel = document.querySelector('.js-edit-board');

    const icons = {
        bold: `<li class="edit-board__item" data-action='makeBold'><i class="fas fa-bold"></i></li>`,
        link: `<li class="edit-board__item" data-action='makeItalic'><i class="fas fa-italic"></i></li>`,
        italic: `<li class="edit-board__item" data-action='makeLink'><i class="fas fa-link"></i></li>`,
        H: `<li class="edit-board__item" data-action='newTitleH2'><i class="fas fa-heading"></i></li>`,
        img: `<li class="edit-board__item" data-action='addImg'><i class="far fa-image"></i></li>`,
        code: `<li class="edit-board__item" data-action='addCode'><i class="fas fa-code"></i></li>`,
        list: `<li class="edit-board__item" data-action='addList'><i class="fas fa-list-ul"></i></li>`,
        par: `<li class='edit-board__item' data-action='newParagraph'><i class="fas fa-paragraph"></i></li>`,
        del: `<li class='edit-board__item' data-action='deleteElem'><i class="fas fa-trash-alt"></i></li>`
    }
    const _templatePanel = {
        def: `
                <ul class="edit-board__items">
                  ${icons.par}
                  ${icons.list}
                  ${icons.img}
                  ${icons.code}
                  ${icons.H}
                  ${icons.bold}
                  ${icons.italic}
                  ${icons.link}
                </ul>
            `,
        list: `
                <ul class='edit-board__items'>
                    ${icons.par}
                    ${icons.H}
                    ${icons.bold}
                    ${icons.italic}
                    ${icons.link}
                </ul>                
            `,
        img: `
            <ul class='edit-board__items'>
                ${icons.par}
                <li class='edit-board__item' data-action='addCaption'><i class="far fa-closed-captioning"></i></li>
                ${icons.del}
            </ul>
            `,
        'img-caption': `
            <ul class='edit-board__items'>
                ${icons.par}
                <li class='edit-board__item' data-action='addCaption'><i class="far fa-closed-captioning"></i></li>
                ${icons.bold}
                ${icons.italic}
                ${icons.link}
            </ul>
            `,
        code: `
            <ul class='edit-board__items'>
                ${icons.del}
                ${icons.par}
            </ul>
            `,
    }

    let _isSelected;
    let _selected;


    const storageRegxFuncToTag = [
        (str = '') => {
            const regx = /(\*{2}).+?(\*{2})/g;
            return str.replace(regx, (str) => {
                str = str.replace(/(\*{2})/, '<b>');
                return str.replace(/(\*{2})/, '</b>');
            });
        },
        (str = '') => {
            const regx = /(\*{1}).+?(\*{1})/g;
            return str.replace(regx, (str) => {
                str = str.replace(/(\*{1})/, '<i>');
                return str.replace(/(\*{1})/, '</i>');
            });
        },
        (str = '') => {
            const regx = /\[.+?\]\(.+?\)/g;
            return str.replace(regx, (str) => {
                const text = str.match(/\[.+?\]/g)[0].replace(/(\[|\])/g, '');
                const href = str.match(/\(.+?\)/g)[0].replace(/(\(|\))/g, '');
                return `<a href='${href}'>${text}</a>`
            });
        }
    ];
    const storageRegxFuncToSymbol = [
        (str = '') => {
            const regx = /(<b>).+?(<\/b>)/g;
            return str.replace(regx, (str) => {
                return str.replace(/(<b>|<\/b>)/g, '**');
            });
        },
        (str = '') => {
            const regx = /(<i>).+?(<\/i>)/g;
            return str.replace(regx, (str) => {
                return str.replace(/(<i>|<\/i>)/g, '*');
            });
        },
        (str = '') => {
            const regx = /<a href=('|").+?('|")>.+?<\/a>/g;
            return str.replace(regx, (str) => {
                const text = str.match(/>.+?</g)[0].replace(/(>|<)/g, '');
                const href = str.match(/href=('|").+?('|")/g)[0].replace(/(href=|('|"))/g, '');
                return `[${text}](${href})`
            });
        }
    ];

    /**
     * def - default
     * list
     * img
     * code
     */
    let _routine = 'def';

    let _that;

    const _checkType = (elem) => {
        return Object.prototype.toString.call(elem).slice(8, -1);
    }

    const _toggleState = (elem, one, two) => {
        if (!elem || !one || !two) return;
        if (_checkType(elem) === 'String')
            elem = document.querySelector(elem);

        elem.setAttribute('data-state', elem.getAttribute('data-state') === one ? two : one);
    }

    const _hasClass = (elem, cls) => {
        if (!elem || !cls) return;
        return elem.classList.contains(cls);
    }

    const _addClass = (elem, ...cls) => {
        if (!elem || [...cls].length === 0) return;
        elem.classList.add(...cls);
    }

    return class T {
        constructor() {
            _that = this;
        }

        Start() {
            if (_articleBlock.children.length === 0) {
                this.newParagraph();
            } else {
                this.OnSelecte(_articleBlock.firstElementChild);
            }

            _articleBlock.addEventListener('click', this.HandlerOnClickArticle);
            _articleBlock.addEventListener('keydown', this.HandlerOnKeyDownArticle);

            _editPanel.addEventListener('click', this.HandlerOnClickEditPanel);
        }

        HandlerOnKeyDownArticle(event) {
            event.stopPropagation();
            if (this.children.length < 1) return;

            switch (event.keyCode) {
                case 38:
                    if (_isSelected.previousElementSibling) {
                        _that.OutSelecte();

                        let preElem = _isSelected.previousElementSibling;
                        if (_hasClass(preElem, 'js-list')) {
                            preElem = preElem.lastElementChild;
                        }

                        _that.OnSelecte(preElem);
                    } else if (_hasClass(_isSelected, 'js-list-item')) {
                        let parentItem = _isSelected.parentElement;
                        if (parentItem.previousElementSibling) {
                            _that.OutSelecte();
                            _that.OnSelecte(parentItem.previousElementSibling);
                        }
                    }

                    break;
                case 40:
                    if (_isSelected.nextElementSibling) {
                        _that.OutSelecte();

                        let nextElem = _isSelected.nextElementSibling;
                        if (_hasClass(nextElem, 'js-list')) {
                            nextElem = nextElem.firstElementChild;
                        }

                        _that.OnSelecte(nextElem);
                    } else if (_hasClass(_isSelected, 'js-list-item')) {
                        let parentItem = _isSelected.parentElement;
                        if (parentItem.nextElementSibling) {
                            _that.OutSelecte();
                            _that.OnSelecte(parentItem.nextElementSibling);
                        }
                    }
                    break;
                default:
                    break;
            }
        }

        HandlerOnClickArticle(event) {
            // event.stopPropagation();
            let target = event.target;

            if (_hasClass(target, 'js-placeholder')) target = target.closest('.js-f');

            if (target === this) {
                if (this.children.length !== 0) {
                    _that.OutSelecte();
                    let put = this.lastElementChild;
                    if (_hasClass(put, 'js-list')) {
                        put = put.lastElementChild;
                    }
                    _that.OnSelecte(put);
                } else {
                    _that.DeleteTextarea();
                    _isSelected = undefined;
                }
                return;
            }

            if (target === _isSelected || !_hasClass(target, 'js-f') || _hasClass(target, 'js-edit-field')) return;

            if ((target !== _isSelected) && _isSelected) _that.OutSelecte();

            _that.OnSelecte(target);
        }

        HandlerOnClickEditPanel(event) {
            event.stopPropagation();
            const target = event.target;

            const actions = {
                showPanel() {
                    _toggleState(_editPanel, 'closed', 'open');
                },
                addList() {
                    _that.AddList();
                },
                newParagraph() {
                    _that.newParagraph();
                },
                newTitleH2() {
                    _that.newTitleH2();
                },
                addImg() {
                    $('.js-upload').attr('data-state', 'show');
                },
                addCaption() {
                    _that.AddImgCaption();
                },
                addCode() {
                    _that.AddBlockCode();
                },
                deleteElem() {
                    _that.DeleteElement();
                },
                makeBold() {
                    _that.insertSymbol('**  **');
                },
                makeItalic() {
                    _that.insertSymbol('*  *');
                },
                makeLink() {
                    _that.insertSymbol('[]()');
                },
            }

            const action = $(target).attr('data-action') ? $(target).attr('data-action') : $(target).closest('[data-action]').attr('data-action');
            action && actions[action] && actions[action]();

            if (action !== 'showPanel') actions.showPanel();
        }

        OnSelecte(selected) {
            _isSelected = selected;

            if (_hasClass(_isSelected, 'js-graf') || _hasClass(_isSelected, 'js-code'))
                this.SetTextarea();

            switch (_isSelected.tagName) {
                case 'LI':
                    setAtr('list')
                    break;
                case 'IMG':
                    setAtr('img')
                    break;
                case 'CODE':
                    setAtr('code')
                    break;
                default:
                    setAtr();
                    break;
            }

            if (_hasClass(_isSelected, 'js-block-img')) setAtr('img');
            else if (_hasClass(_isSelected, 'js-img-graf')) setAtr('img-caption');

            _routine = _articleBlock.getAttribute('data-routine');

            function setAtr(str = 'def') {
                _articleBlock.setAttribute('data-routine', str);
                document.querySelector('.js-edit-content').innerHTML = _templatePanel[str];
            }
        }

        OutSelecte() {
            this.DeleteTextarea();
        }

        AddNewElement(tag, str, cls, parent = _articleBlock) {
            if (!tag) return;
            const elem = this.CreateNewElement(tag, str, cls);
            this.InsertNewElement(elem, parent);
            this.OutSelecte();
            this.OnSelecte(elem);
        }

        CreateNewElement(tag, str, cls) {
            if (!tag) return;
            const elem = document.createElement(tag);
            if (str) elem.textContent = str;
            if (cls) {
                if (_checkType(cls) === 'Array')
                    _addClass(elem, ...cls);
                else
                    _addClass(elem, cls);
            }
            return elem;
        }

        InsertNewElement(elem, parent = _articleBlock) {
            if (!elem) return;
            if (_isSelected && parent.children.length > 1) {
                parent.insertBefore(elem, _isSelected);
                parent.insertBefore(_isSelected, elem);
            } else {
                parent.appendChild(elem);
            }
        }

        DeleteElement() {
            let parent = _articleBlock;
            let put;

            if (_isSelected.parentElement !== parent) {
                if (_isSelected.parentElement.children.length === 1 || !_hasClass(_isSelected, 'js-graf')) {
                    _isSelected = _isSelected.parentElement;
                    while (_isSelected.parentElement !== _articleBlock) {
                        _isSelected = _isSelected.parentElement;
                    }
                } else {
                    parent = _isSelected.parentElement;
                }
            }

            if (_isSelected.nextElementSibling) {
                put = _isSelected.nextElementSibling;
                if (_hasClass(put, 'js-list')) {
                    put = put.firstElementChild;
                }
            } else if (_isSelected.previousElementSibling) {
                put = _isSelected.previousElementSibling;
                if (_hasClass(put, 'js-list')) {
                    put = put.lastElementChild;
                } else if (_hasClass(put, 'js-block-img')) {
                    put = put.lastElementChild;
                    put = put.firstElementChild;
                }
            }

            parent.removeChild(_isSelected);

            !put ? _isSelected = put : '';
            put ? this.OnSelecte(put) : this.newParagraph();
        }

        newParagraph() {
            let parent = _articleBlock;
            if (_isSelected && _isSelected.parentElement != parent) {
                this.OutSelecte();
                while (_isSelected.parentElement != parent) {
                    _isSelected = _isSelected.parentElement;
                }
            }

            this.AddNewElement('p', '', ['js-graf', 'js-f', 'is-empty']);
        }

        newTitleH2() {
            let parent = _articleBlock;
            if (_isSelected && _isSelected.parentElement != parent) {
                this.OutSelecte();
                while (_isSelected.parentElement != parent) {
                    _isSelected = _isSelected.parentElement;
                }
            } else if (_isSelected.tagName === 'P') {
                const title = this.CreateNewElement('h2', '', ['js-graf', 'js-f']);
                this.OutSelecte();
                _articleBlock.replaceChild(title, _isSelected);
                this.OnSelecte(title);
            } else {
                this.AddNewElement('h2', '', ['js-graf', 'js-f']);
            }
        }

        AddList() {
            const item = this.CreateNewElement('li', '', ['js-graf', 'js-f', 'js-list-item']);
            const list = this.CreateNewElement('ul', '', 'js-list');
            list.appendChild(item);
            _articleBlock.replaceChild(list, _isSelected);

            this.OnSelecte(item);
        }

        AddBlockImg(url) {
            const blockImg = this.CreateNewElement('div', '', ['block-img', 'js-block-img'])
            const containerImg = this.CreateNewElement('div', '', ['block-img__img', 'js-f']);

            const img = this.CreateNewElement('img', '', ['js-img', 'js-f']);
            img.src = url;

            containerImg.appendChild(img)
            blockImg.appendChild(containerImg);
            this.InsertNewElement(blockImg);

            // _articleBlock.replaceChild(blockImg, _isSelected);

            this.OutSelecte();
            $('.js-upload').attr('data-state', 'hidden');
            this.OnSelecte(blockImg);
        }

        AddImgCaption() {
            const captionText = prompt('Enter any text', '');
            if (!captionText) return;

            const containerCaption = this.CreateNewElement('div', '', 'block-img__caption');
            const caption = this.CreateNewElement('span', captionText, ['js-graf', 'js-img-graf', 'js-f']);
            // this.InsertNewElement(el, _isSelected.parentElement);

            containerCaption.appendChild(caption);
            _isSelected.closest('.js-block-img').appendChild(containerCaption);

            this.OutSelecte();
            this.OnSelecte(caption);
        }

        AddBlockCode() {
            const figure = this.CreateNewElement('figure', '', 'highlight');
            const pre = this.CreateNewElement('pre');
            const code = this.CreateNewElement('code', '', ['js-code', 'js-f']);

            pre.appendChild(code);
            figure.appendChild(pre);

            _articleBlock.replaceChild(figure, _isSelected);
            this.OnSelecte(code);
        }

        insertSymbol(insetStr) {
            function getCaret(el) {
                return el.selectionStart;
            }

            function getPosInRow(el) {
                var caret = getCaret(el);
                var text = el.value.substr(0, caret).replace(/^(.*[\n\r])*([^\n\r]*)$/, '$2');

                return text.length;
            }

            const textarea = document.querySelector('.js-edit-field');
            const pos = getPosInRow(textarea);
            textarea.value = textarea.value.substr(0, pos) + ` ${insetStr} ` + textarea.value.substr(pos);
        }

        SetTextarea() {
            if (_hasClass(_isSelected, 'is-selected')) return;

            const textarea = this.CreateNewElement('textarea', '', ['edit-textarea', 'js-edit-field']);
            // textarea.value = _hasClass(_isSelected, 'is-empty') ? '' : _isSelected.textContent;
            let str = _isSelected.innerHTML;
            if (!_hasClass(_isSelected, 'is-empty') && str) {
                storageRegxFuncToSymbol.forEach((item) => {
                    str = item(str);
                });
                textarea.value = str;
            }
            textarea.placeholder = 'TITLE';

            _addClass(_isSelected, 'is-selected');
            _isSelected.textContent = '';
            _isSelected.appendChild(textarea);

            textarea.addEventListener('keydown', function (event) {

                if (event.keyCode === 13) {
                    if (_routine === 'code') return;
                    if (_routine === 'list')
                        _that.AddNewElement('li', '', ['js-graf', 'js-f', 'js-list-item'], _isSelected.parentElement);
                    else
                        _that.newParagraph();
                    return;
                }
                if (event.keyCode === 8) {
                    if (this.value.length === 0)
                        _that.DeleteElement();
                    return;
                }
            });

            autosize($('.js-edit-field'));
            textarea.focus();
        }

        DeleteTextarea() {
            if (_isSelected && _hasClass(_isSelected, 'is-selected')) {
                const textarea = document.querySelector('.js-edit-field');
                let str = textarea.value;

                // if (!str) {
                //     _addClass(_isSelected, 'is-empty');
                // } else {
                //     _hasClass(_isSelected, 'is-empty') && _isSelected.classList.remove('is-empty');
                // }

                _isSelected.removeChild(textarea);
                if (!str) {
                    _isSelected.appendChild(this.CreateNewElement('span', 'Enter any text', ['placeholder', 'js-placeholder']));
                    _addClass(_isSelected, 'is-empty');
                } else {
                    _hasClass(_isSelected, 'is-empty') && _isSelected.classList.remove('is-empty');

                    storageRegxFuncToTag.forEach((item) => {
                        str = item(str);
                    });

                    _isSelected.innerHTML = str;
                }
                _isSelected.classList.remove('is-selected');
            }
        }
    }
})();