$(".js-admin-delete-article").click(function() {
  const idPost = $(this).attr("data-post-id");
  const idAuthor = $(this).attr("data-author-id");
  if (!idPost || !idAuthor) return;

  $.ajax({
    method: "DELETE",
    url: "/admin/delete/post",
    data: JSON.stringify({ idPost, idAuthor }),
    contentType: "application/json",
    success(data) {
      location.href = "/";
    },
    error(err) {
      location.reload();
    }
  });
});

$(".js-admin-delete-comment").click(function() {
  const idPost = $(this).attr("data-post-id");
  const idComment = $(this).attr("data-comment-id");
  const idAuthor = $(this).attr("data-author-id");
  if (!idComment || !idAuthor || !idPost) return;

  $.ajax({
    method: "DELETE",
    url: "/admin/delete/comment",
    data: JSON.stringify({ idComment, idAuthor, idPost }),
    contentType: "application/json",
    success(data) {
      location.reload();
    },
    error(err) {
      location.reload();
    }
  });
});
