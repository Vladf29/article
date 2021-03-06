"use strict";

import template from "./template";
import regxFunc from "./regxFunc";

import { _addClass, _checkType, _toggleState, _hasClass } from "./helperFunc";

const _articleBlock = document.querySelector(".js-article");
const _editPanel = document.querySelector(".js-edit-board");
const _notifQ = $(".js-notif");

let _isSelected;
const storageData = {
  topics: [],
  data: []
};

/**
 * def - default
 * list
 * img
 * img-caption
 * code
 * title
 */
let _routine = "def";

let _that;
let _id;

const _templatePanel = template.panels;

const regxFuncToTag = regxFunc.toTag;
const regxFuncToSymbol = regxFunc.toSymbol;

export default class Editor {
  constructor() {
    _that = this;
  }

  Init() {
    const cookies = {};
    document.cookie.split(";").forEach(item => {
      const cookie = item.split("=").map(i =>
        i
          .split(" ")
          .filter(i => i != false)
          .join("")
      );
      cookies[cookie[0]] = cookie[1];
    });

    const idCookies = cookies["idPost"]
      ? "idPost"
      : cookies["DrafPostId"]
        ? "DrafPostId"
        : "";

    if (idCookies) {
      $.ajax({
        method: "GET",
        url: `/posts/${
          idCookies === "idPost"
            ? "edit/downloadPost"
            : "write_a_post/downloadDraft"
        }`,
        success: function(data) {
          _id = cookies["idCookies"];
          _that.filingEditorByPost(data);
          _that.Start();
        },
        error: function(err) {
          if (err.status === 404)
            return (location.href = "/posts/write_a_post");
        }
      });
    } else {
      this.Start();
    }
  }
  Start() {
    if (_articleBlock.children.length === 0) {
      this.addMainFields();
      this.OnSelecte(document.querySelector(".js-graf"));
    } else {
      this.OnSelecte(_articleBlock.firstElementChild);
    }

    _articleBlock.addEventListener("click", this.HandlerOnClickArticle);
    _articleBlock.addEventListener("keydown", this.HandlerOnKeyDownArticle);

    _editPanel.addEventListener("click", this.HandlerOnClickEditPanel);
  }

  HandlerOnKeyDownArticle(event) {
    event.stopPropagation();
    if (this.children.length < 1) return;

    switch (event.keyCode) {
      case 38:
        if (_isSelected.previousElementSibling) {
          _that.OutSelecte();

          let preElem = _isSelected.previousElementSibling;
          if (_hasClass(preElem, "js-list")) {
            preElem = preElem.lastElementChild;
          }

          _that.OnSelecte(preElem);
        } else if (_hasClass(_isSelected, "js-list-item")) {
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
          if (_hasClass(nextElem, "js-list")) {
            nextElem = nextElem.firstElementChild;
          }

          _that.OnSelecte(nextElem);
        } else if (_hasClass(_isSelected, "js-list-item")) {
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

    if (_hasClass(target, "js-placeholder")) target = target.closest(".js-f");

    if (target === this) {
      if (this.children.length !== 0) {
        _that.OutSelecte();
        let put = this.lastElementChild;
        if (_hasClass(put, "js-list")) {
          put = put.lastElementChild;
        }
        _that.OnSelecte(put);
      } else {
        _that.DeleteTextarea();
        _isSelected = undefined;
      }
      return;
    }

    if (
      target === _isSelected ||
      !_hasClass(target, "js-f") ||
      _hasClass(target, "js-edit-field")
    )
      return;

    if (target !== _isSelected && _isSelected) _that.OutSelecte();

    _that.OnSelecte(target);
  }

  HandlerOnClickEditPanel(event) {
    event.stopPropagation();
    const target = event.target;

    const actions = {
      showPanel() {
        _toggleState(_editPanel, "closed", "open");
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
        $(".js-upload").attr("data-state", "show");
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
        _that.insertSymbol("**  **");
      },
      makeItalic() {
        _that.insertSymbol("*  *");
      },
      makeLink() {
        _that.insertSymbol("[]()");
      }
    };

    const action = $(target).attr("data-action")
      ? $(target).attr("data-action")
      : $(target)
          .closest("[data-action]")
          .attr("data-action");
    action && actions[action] && actions[action]();

    if (action !== "showPanel") actions.showPanel();
  }

  OnSelecte(selected) {
    _isSelected = selected;

    if (_hasClass(_isSelected, "js-graf") || _hasClass(_isSelected, "js-code"))
      this.SetTextarea();

    switch (_isSelected.tagName) {
      case "LI":
        setAtr("list");
        break;
      case "IMG":
        setAtr("img");
        break;
      case "CODE":
        setAtr("code");
        break;
      default:
        setAtr();
        break;
    }

    if (
      _hasClass(_isSelected, "js-block-img") ||
      _hasClass(_isSelected, "js-container-img")
    )
      setAtr("img");
    else if (_hasClass(_isSelected, "js-img-caption")) setAtr("img-caption");
    else if (_hasClass(_isSelected, "js-title")) setAtr("title");

    _routine = _articleBlock.getAttribute("data-routine");

    function setAtr(str = "def") {
      _articleBlock.setAttribute("data-routine", str);
      document.querySelector(".js-edit-content").innerHTML =
        _templatePanel[str];
    }
  }

  OutSelecte() {
    this.DeleteTextarea();
  }

  filingEditorByPost({ data = [], content = [], topics = [] }) {
    data = data.length === 0 ? (content.length !== 0 ? content : data) : data;
    if (topics.length !== 0) {
      $(".js-btn-topic")
        .attr("data-chosen-topic", "false")
        .addClass("btn_outline")
        .removeClass("btn_primary");
      topics.forEach(topic => {
        $(`.js-btn-topic[data-topic='${topic}']`)
          .attr("data-chosen-topic", "true")
          .removeClass("btn_outline")
          .addClass("btn_primary");
      });
    }

    data.forEach(item => {
      const type = item.type;
      let elem;
      switch (type) {
        case "mainTitle": {
          const title = `<h1 class="js-graf js-title js-f js-plain js-main-field" data-name="mainTitle" data-touch="touch" data-remove="false">${
            item.text
          }</h1>`;
          _articleBlock.innerHTML = title;
          break;
        }
        case "mainImg": {
          elem = this.AddMainImg(
            item.src,
            item.caption ? item.caption : "",
            false
          );
          break;
        }
        case "par": {
          elem = this.newParagraph("", false);
          elem.innerHTML = item.text;
          break;
        }
        case "list": {
          const list = this.AddList(item.items[0], false);
          for (let i = 1; i < item.items.length; i++) {
            const t = this.AddListItem("", list, false);
            t.innerHTML = item.items[i];
          }
          elem = list;
          break;
        }
        case "title": {
          elem = this.newTitleH2("", false);
          elem.innerHTML = item.text;
          break;
        }
        case "img": {
          elem = this.AddBlockImg(item.src, false);
          if (item.caption) this.AddImgCaption(item.caption, elem, false);
          break;
        }
        default:
          break;
      }
      if (elem) {
        $(elem).attr("data-touch", "touch");
        _articleBlock.appendChild(elem);
      }
    });
  }

  AddNewElement(tag, str, cls, parent = _articleBlock) {
    if (!tag) return;
    const elem = this.CreateNewElement(tag, str, cls);
    this.InsertNewElement(elem, parent);
    return elem;
  }

  CreateNewElement(tag, str, cls) {
    if (!tag) return;
    const elem = document.createElement(tag);
    if (str) elem.textContent = str;
    if (cls) {
      if (_checkType(cls) === "Array") _addClass(elem, ...cls);
      else _addClass(elem, cls);
    }

    if (_notifQ.hasClass("notif--success"))
      _notifQ.removeClass("notif--success");
    return elem;
  }

  InsertNewElement(elem, parent = _articleBlock) {
    if (!elem) return;
    if (
      _isSelected &&
      parent.children.length > 1 &&
      _isSelected !== parent.lastElementChild
    ) {
      if ($(_isSelected.nextElementSibling).hasClass("js-main-field")) {
        const ne = _isSelected.nextElementSibling;
        parent.insertBefore(elem, ne);
        parent.insertBefore(ne, elem);
      } else {
        parent.insertBefore(elem, _isSelected);
        parent.insertBefore(_isSelected, elem);
      }
    } else {
      parent.appendChild(elem);
    }
  }

  DeleteElement() {
    let parent = _articleBlock;
    let put;
    const altSelected = _isSelected;

    // if (false && _isSelected.parentElement !== parent) {
    //     if (!_hasClass(_isSelected, 'js-list-item')) {
    //         parent = _isSelected.parentElement;
    //     } else if (_isSelected.parentElement.children.length === 1 && !_hasClass(_isSelected, 'js-graf')) {
    //         _isSelected = _isSelected.parentElement;

    //         while (_isSelected.parentElement !== _articleBlock) {
    //             _isSelected = _isSelected.parentElement;
    //         }
    //     } else {
    //         if (_hasClass(_isSelected, 'js-img-caption')) {
    //             _isSelected = _isSelected.parentElement;
    //         }
    //         _isSelected = _isSelected.parentElement;
    //     }
    // }

    if (_isSelected.parentElement !== parent) {
      if (_hasClass(_isSelected, "js-list-item")) {
        parent = _isSelected.parentElement;
        if (parent.children.length === 1) {
          _isSelected = parent;
          parent = parent.parentElement;
        }
      } else if (_hasClass(_isSelected, "js-img-caption")) {
        _isSelected = _isSelected.parentElement;
        parent = _isSelected.parentElement;
      } else {
        parent = _isSelected.parentElement;
        if (_hasClass(parent, "js-container") && parent.children.length < 2) {
          _isSelected = parent;
          parent = parent.parentElement;
        }
      }
    }

    if (_isSelected.nextElementSibling) {
      put = _isSelected.nextElementSibling;
    } else if (_isSelected.previousElementSibling) {
      put = _isSelected.previousElementSibling;
      if (_hasClass(put, "js-main-field")) put = parent.firstElementChild;
    }

    if ($(altSelected).attr("data-remove") !== "false") {
      parent.removeChild(_isSelected);
      !put ? (_isSelected = put) : "";
      put ? this.OnSelecte(put) : this.newParagraph();
    }
  }

  newParagraph(str = "", select = true) {
    let parent = _articleBlock;
    if (_isSelected && _isSelected.parentElement != parent) {
      this.OutSelecte();
      while (_isSelected.parentElement != parent) {
        _isSelected = _isSelected.parentElement;
      }
    }

    const par = this.AddNewElement("p", str, ["js-graf", "js-f", "js-plain"]);
    par.setAttribute("data-name", `par`);
    par.setAttribute("data-touch", "untouch");
    par.setAttribute("data-placeholder", "any text");
    par.setAttribute("data-index", _articleBlock.children.length - 1);

    if (select) {
      this.OutSelecte();
      this.OnSelecte(par);
    }

    return par;
  }

  newTitleH2(str = "", select = true) {
    let parent = _articleBlock;
    const clss = ["js-graf", "js-f", "js-plain", "js-title"];

    if (_isSelected && _isSelected.parentElement != parent) {
      while (_isSelected.parentElement != parent) {
        _isSelected = _isSelected.parentElement;
      }
    }
    if (false && _isSelected && _isSelected.tagName === "P") {
      const title = this.CreateNewElement("h2", str, clss.slice());
      title.setAttribute("data-name", `title`);
      title.setAttribute("data-touch", "untouch");
      this.OutSelecte();
      _articleBlock.replaceChild(title, _isSelected);
      this.OnSelecte(title);
    } else {
      const title = this.AddNewElement("h2", str, clss.slice());
      // const title = this.AddNewElement('h2', '', ['js-graf', 'js-f', 'js-empty', 'js-plain']);
      title.setAttribute("data-name", "title");
      title.setAttribute("data-touch", "untouch");
      title.setAttribute("data-placeholder", "title");
      if (select) {
        this.OutSelecte();
        this.OnSelecte(title);
      }
      return title;
    }
  }

  AddList(str = "", select = true) {
    const item = this.CreateNewElement("li", str, [
      "js-graf",
      "js-f",
      "js-list-item"
    ]);
    item.setAttribute("data-placeholder", "any text");

    const list = this.CreateNewElement("ul", "", ["js-list", "js-container"]);
    list.setAttribute("data-name", `list`);
    list.setAttribute("data-touch", `untouch`);
    list.appendChild(item);

    if (select) {
      // if (_hasClass(_isSelected.nextElementSibling, 'js-main-field')) {
      //     const ne = _isSelected.nextElementSibling;
      //     this.InsertNewElement(list);
      //     this.OutSelecte();
      // } else {
      //     _articleBlock.replaceChild(list, _isSelected);
      // }
      this.InsertNewElement(list);
      this.OutSelecte();
      this.OnSelecte(item);
    }
    return list;
  }
  AddListItem(str = "", parent = _isSelected.parentElement, select = true) {
    const item = _that.AddNewElement(
      "li",
      str,
      ["js-graf", "js-f", "js-list-item"],
      parent
    );
    item.setAttribute("data-placeholder", "any text");
    if (select) {
      this.OutSelecte();
      this.OnSelecte(item);
    }
    return item;
  }

  addMainFields(opt) {
    const title = `<h1 class="js-graf js-f js-title js-plain is-empty js-main-field" data-placeholder='main title' data-name="mainTitle" data-touch="untouch" data-remove="false"></h1>`;
    const img = `<div class="block-img block-img--main js-block-main js-container js-main-field" data-name="mainImg" data-touch="untouch" data-remove="false" data-empty="true">
                            <div class="block-img__placeholder">Set main image</div>
                        </div>`;
    switch (opt) {
      case "img": {
        return img;
        break;
      }
      case "title": {
        return title;
        break;
      }
      default: {
        const str = title + img;
        $(_articleBlock).html(str);
        break;
      }
    }
  }

  AddMainImg(url, caption = "", select = true) {
    const blockImg = this.AddBlockImg(url, select);
    $(blockImg).attr("data-touch", "touch");
    $(blockImg).attr("data-remove", "false");
    $(blockImg).attr("data-name", "mainImg");

    $(blockImg).addClass("block-img--main js-block-main js-main-field");

    if (caption) this.AddImgCaption(caption, blockImg, false);

    const deleteElem = this.CreateNewElement("div", "", [
      "block-img__delete",
      "js-block-delete"
    ]);
    deleteElem.innerHTML = `<i class='fas fa-minus'></i>`;
    blockImg.appendChild(deleteElem);

    const mainImg = $(".js-block-main");
    if (mainImg.length !== 0) mainImg.replaceWith(blockImg);
    else _articleBlock.appendChild(blockImg);
  }

  AddBlockImg(url, select = true) {
    const blockImg = this.CreateNewElement("div", "", [
      "block-img",
      "js-block-img",
      "js-container"
    ]);
    blockImg.setAttribute("data-name", `img`);
    const containerImg = this.CreateNewElement("div", "", [
      "block-img__img",
      "js-container-img",
      "js-f"
    ]);

    const img = this.CreateNewElement("img", "", ["js-img", "js-f"]);
    img.src = url;

    containerImg.appendChild(img);
    blockImg.appendChild(containerImg);
    $(".js-upload").attr("data-state", "hidden");
    if (select) {
      this.InsertNewElement(blockImg);
      this.OutSelecte();
      this.OnSelecte(blockImg);
    }
    return blockImg;
  }

  AddImgCaption(str = "", elem = _isSelected, select = true) {
    const a = $(elem)
      .closest(".block-img")
      .find(".block-img__caption");
    if (a.length !== 0) return;

    const containerCaption = this.CreateNewElement(
      "div",
      "",
      "block-img__caption"
    );
    const caption = this.CreateNewElement("span", str, [
      "js-graf",
      "js-img-caption",
      "js-f"
    ]);
    caption.setAttribute("data-placeholder", "any text");

    containerCaption.appendChild(caption);
    elem.closest(".js-block-img").appendChild(containerCaption);

    if (select) {
      this.OutSelecte();
      this.OnSelecte(caption);
    }

    return containerCaption;
  }

  AddBlockCode() {
    const figure = this.CreateNewElement("figure", "", "highlight");
    const pre = this.CreateNewElement("pre");
    const code = this.CreateNewElement("code", "", ["js-code", "js-f"]);

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
      var text = el.value
        .substr(0, caret)
        .replace(/^(.*[\n\r])*([^\n\r]*)$/, "$2");

      return text.length;
    }

    const textarea = document.querySelector(".js-edit-field");
    const pos = getPosInRow(textarea);
    textarea.value =
      textarea.value.substr(0, pos) +
      ` ${insetStr} ` +
      textarea.value.substr(pos);
  }

  SetTextarea() {
    if (_hasClass(_isSelected, "is-selected")) return;

    const textarea = this.CreateNewElement("textarea", "", [
      "edit-textarea",
      "js-edit-field"
    ]);

    if (!_hasClass(_isSelected, "is-empty")) {
      let str = _isSelected.innerHTML;
      if (!_hasClass(_isSelected, "is-empty") && str) {
        regxFuncToSymbol.forEach(item => {
          str = item(str);
        });
      }
      textarea.value = str;
    }
    // textarea.placeholder = 'TITLE';

    if (_isSelected && $(_isSelected).attr("data-placeholder"))
      textarea.placeholder = `Enter ${$(_isSelected).attr("data-placeholder")}`;

    _addClass(_isSelected, "is-selected");
    _isSelected.textContent = "";
    _isSelected.appendChild(textarea);

    textarea.addEventListener("keydown", this.handlerTextarea);

    autosize($(".js-edit-field"));
    textarea.focus();
  }

  handlerTextarea(event) {
    if (event.keyCode === 13) {
      if (_routine === "code") return;
      if (_routine === "list") _that.AddListItem();
      else _that.newParagraph();
      return;
    }
    if (event.keyCode === 8) {
      if (this.value.length === 0) _that.DeleteElement();
      return;
    }
  }

  DeleteTextarea() {
    if (_isSelected && _hasClass(_isSelected, "is-selected")) {
      const textarea = document.querySelector(".js-edit-field");
      let str = textarea.value;
      // const placeholder  = $(textarea).attr('placeholder');
      const { placeholder } = textarea;

      _isSelected.removeChild(textarea);
      _isSelected.classList.remove("is-selected");

      if (!str) {
        _isSelected.appendChild(
          this.CreateNewElement("span", placeholder || "Enter any text", [
            "placeholder",
            "js-placeholder"
          ])
        );
        _addClass(_isSelected, "is-empty");
      } else {
        _hasClass(_isSelected, "is-empty") &&
          _isSelected.classList.remove("is-empty");
        if (!$(_isSelected).hasClass("js-plain")) {
          const container = $(_isSelected).closest(".js-container");
          if (container.attr("data-touch") === "untouch")
            container.attr("data-touch", "touch");
        } else {
          if ($(_isSelected).attr("data-touch") === "untouch")
            $(_isSelected).attr("data-touch", "touch");
        }

        regxFuncToTag.forEach(item => {
          str = item(str);
        });

        _isSelected.innerHTML = str;
      }
    }
  }

  SetDataForSend() {
    if (storageData.data.length === 0 && _articleBlock.children.length === 0)
      return;
    storageData.data = [];
    this.OutSelecte();
    $(_articleBlock)
      .children()
      .each(function(ind) {
        const elem = $(this);
        if (!elem.hasClass("js-plain")) {
          const container = elem.closest(".js-container");
          if (container.attr("data-touch") === "untouch") return;

          const type = container.attr("data-name");
          const key = container.attr("data-index");

          switch (type) {
            case "mainImg": {
            }
            case "img": {
              const img = container.find("img").prop("src");
              const caption =
                container.find(".js-img-caption").length !== 0
                  ? container.find(".js-img-caption").html()
                  : "";

              const a = {
                type,
                ind: +key,
                src: img,
                caption
              };
              storageData.data.push(a);
              break;
            }
            case "list": {
              const list = {
                type,
                ind: +key,
                items: []
              };
              container.children().each(function(ind) {
                list.items.push(
                  $(this).hasClass("is-empty") ? "" : $(this).html()
                );
              });

              storageData.data.push(list);
              break;
            }

            default:
              break;
          }
        } else {
          if (elem.attr("data-touch") === "untouch") return;
          const str = elem.html();
          const key = elem.attr("data-index")
            ? elem.attr("data-index")
            : _articleBlock.children.length;
          const type = elem.attr("data-name");

          const a = {
            text: elem.hasClass("is-empty") ? "" : str,
            ind: +key,
            type
          };
          storageData.data.push(a);
        }
      });

    this.OnSelecte(_isSelected);
  }

  SetSequenceNumber() {
    $(_articleBlock)
      .children()
      .each(function(ind) {
        let attr = "";
        if (!_hasClass(_isSelected, "js-plain")) {
          const container = $(_isSelected).closest(".js-container");
          attr = container.attr("data-index");
        } else {
          attr = $(this).attr("data-index");
        }
        if (!attr) return $(this).attr("data-index", `${ind}`);
        if (attr != ind) {
          $(this).attr("data-index", `${ind}`);
        }
      });
  }

  Save(url) {
    if (!url) return url;
    storageData.data = [];
    storageData.topics = [];
    this.SetSequenceNumber();
    this.SetDataForSend();

    if (storageData.data.length === 0 && _articleBlock.children.length === 0)
      return;

    storageData.data.sort((a, b) => a.ind - b.ind);
    $(".js-btn-topic[data-chosen-topic=true]").each(function() {
      const target = $(this);
      if (target.attr("data-chosen-topic") === "true") {
        if (!target.attr("data-topic")) return;
        storageData.topics.push(target.attr("data-topic"));
      }
    });

    if (_notifQ.hasClass("notif--success"))
      _notifQ.removeClass("notif--success");

    $.ajax({
      method: "POST",
      url: url,
      data: JSON.stringify({
        id: _id,
        data: storageData
      }),
      contentType: "application/json",
      success: function(data) {
        _notifQ.addClass("notif--success");
        // localStorage.setItem('id_article_draft', data.id);
      },
      error: function(err) {
        console.log("err");
        console.log(err);
      }
    });
  }

  WriteNewPost() {
    document.cookie = `DrafPostId=;path=${
      location.pathname
    };expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    location.href = "/posts/write_a_post";
  }

  Publish() {
    this.SetSequenceNumber();
    this.SetDataForSend();

    if (storageData.data.length === 0 && _articleBlock.children.length === 0)
      return;

    storageData.data.sort((a, b) => a.ind - b.ind);

    $(".js-btn-topic[data-chosen-topic=true]").each(function() {
      const target = $(this);
      if (target.attr("data-chosen-topic") === "true") {
        if (!target.attr("data-topic")) return;
        storageData.topics.push(target.attr("data-topic"));
      }
    });

    if (_notifQ.hasClass("notif--success"))
      _notifQ.removeClass("notif--success");

    $.ajax({
      method: "POST",
      url: "/posts/write_a_post/publish",
      data: JSON.stringify({
        id: _id,
        data: storageData
      }),
      contentType: "application/json",
      success: function(data) {
        location.reload();
        // location.href = `/posts/post/${data.id}`;
      },
      error: function(err) {
        location.reload();
      }
    });

    storageData.data = [];
    storageData.topics = [];
  }

  Delete(url) {
    if (!url) return url;
    $.ajax({
      method: "DELETE",
      url: url,
      data: JSON.stringify({
        id: _id
      }),
      contentType: "application/json",
      success: function() {
        location.reload();
      }
    });
  }
}
