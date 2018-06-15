"use strict";

import uploadImg from "./modules/uploadImg";
import Editor from "./modules/editor/index";

const editor = new Editor();
editor.Init();

uploadImg();

let flagMainImgClick = false;

$(document.body).on("click", ".js-block-main[data-empty=true]", function() {
  $(".js-upload").attr("data-state", "show");
  flagMainImgClick = true;
});

$(document.body).on("click", ".js-block-delete", function(event) {
  event.stopPropagation();
  $(".js-block-main").replaceWith(editor.addMainFields("img"));
});

$(".js-preview-action").on("click", ".btn", function() {
  const action = $(this).attr("data-action");
  switch (action) {
    case "cancel":
      $(".js-preview")
        .attr("data-state", "hidden")
        .find(".preview-c img")
        .remove();
      $(
        `.js-upload-content[data-type=${$(".js-preview").attr("data-show")}]`
      ).attr("data-state", "show");

      if ($(".js-preview").attr("data-show") === "laptop") {
        $("#userImg").val("");
      } else {
        $("#userURLImg").val("");
      }

      break;
    case "save":
      if ($(".js-preview").attr("data-show") === "laptop" && false) {
        editor.AddBlockImg();
      } else {
        if (flagMainImgClick) {
          editor.AddMainImg($("#userURLImg").val());
          flagMainImgClick = false;
        } else {
          editor.AddBlockImg($("#userURLImg").val());
        }
      }
      break;
    default:
      break;
  }
});

$(".js-btns-action").click(function(event) {
  event.preventDefault();
  const target = $(event.target);
  const attr = target.attr("data-action");

  switch (attr) {
    case "publish":
      editor.Publish();
      break;
    case "save": {
      const actionUrl = target.attr("data-action-url");
      if (!actionUrl) return;
      editor.Save(actionUrl);
      break;
    }
    case "newPost":
      editor.WriteNewPost();
      break;
    case "delete": {
      const actionUrl = target.attr("data-action-url");
      if (!actionUrl) return;
      editor.Delete(actionUrl);
      break;
    }
    default:
      break;
  }
});

$(".js-btns-topics").click(function(e) {
  const target = $(e.target);
  const chosen = target.attr("data-chosen-topic");
  if (!chosen) return;
  if (chosen === "true") {
    target
      .removeClass("btn_primary")
      .addClass("btn_outline")
      .attr("data-chosen-topic", "false");
  } else {
    target
      .removeClass("btn_outline")
      .addClass("btn_primary")
      .attr("data-chosen-topic", "true");
  }
});
