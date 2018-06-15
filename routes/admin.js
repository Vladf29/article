const router = require("express-promise-router")();

const authorized = require("../modules/authorized");

const Posts = require("../db/articles");
const Users = require("../db/users");

router.use("/delete", authorized.isAuthorized);

// router.get("/", (req, res) => {});

router.delete("/delete/comment", async (req, res) => {
  const { idComment, idAuthor, idPost } = req.body;
  if (!idPost) {
    req.flash("error", "Where where where is post id?");
    return res.status(400).send();
  }

  if (!idComment) {
    req.flash("error", "Where where where is comment id?");
    return res.status(400).send();
  }

  if (!idAuthor) {
    req.flash("error", "Where where where is author id?");
    return res.status(400).send();
  }

  const [post, user] = await Promise.all([
    Posts.findById(idPost),
    Users.findOne({ username: idAuthor })
  ]);
  if (!post || !user) return res.status(404).send("Not found!");

  post.comments.pull(idComment);
  user.comments.pull(idComment);

  await Promise.all([post.save(), user.save()]);

  req.flash("success", "Comment was removed");
  res.send();
});
router.delete("/delete/post", async (req, res) => {
  const { idPost, idAuthor } = req.body;
  if (!idPost) {
    req.flash("error", "Where where where is post id?");
    return res.status(400).send();
  }

  if (!idAuthor) {
    req.flash("error", "Where where where is author id?");
    return res.status(400).send();
  }
  const [post, user] = await Promise.all([
    Posts.findById(idPost),
    Users.findOne({ username: idAuthor })
  ]);
  if (!user) {
    req.flash("error", "Oh user wasn't found");
    return res.status(401).send();
  }
  if (!post) {
    req.flash("error", "Sorry but the post wasn't found");
    return res.status(404).send();
  }

  await Promise.all([user.articles.pull(idPost), post.remove()]);
  await Promise.all([user.save(), post.save()]);

  req.flash("success", "Removed");
  res.send("OK");
});

module.exports = router;
