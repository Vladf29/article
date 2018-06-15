"use strict";

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
};
const panels = {
  def: `
            <ul class="edit-board__items">
              ${icons.par}
              ${icons.H}
              ${icons.bold}
              ${icons.italic}
              ${icons.link}
              ${icons.list}
              ${icons.img}
            </ul>
        `,
  // ${icons.code}
  title: `
    <ul class="edit-board__items">
              ${icons.par}
              ${icons.H}
              ${icons.italic}
              ${icons.link}
              ${icons.list}
              ${icons.img}
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
            ${icons.H}            
            ${icons.par}
            <li class='edit-board__item' data-action='addCaption'><i class="far fa-closed-captioning"></i></li>
            ${icons.del}
        </ul>
        `,
  "img-caption": `
        <ul class='edit-board__items'>
            ${icons.par}
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
        `
};

export default {
  panels
};
