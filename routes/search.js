const router = require("express-promise-router")();

const Post = require("../db/articles");

router.get("/", async (req, res) => {
  const query = req.query;
  const { value } = query;
  if (!value) {
    req.flash("error", "Empty input");
    return res.redirect("/");
  }

  const posts = await Post.find({}).populate("author", [
    "username",
    "name",
    "avatarUrl"
  ]);

  if (!posts) {
    req.flash("error", "Post not");
    return res.redirect("/");
  }

  const regx = new RegExp(value, "gim");

  const n = posts.filter(post => {
    const content = JSON.parse(post.content.toString());

    const found = content.find(item => {
      let test = false;
      if (item.type === "img" || item.type === "mainImg") {
        if (item.caption) test = regx.test(item.caption);
      } else if (item.type === "list") {
      } else {
        if (item.text) test = regx.test(item.text);
      }
      return test;
    });

    return found;
  });

  //   return res.json(n)

  res.render("index", {
    posts: n,
    topic: `Search: '${value}' Results: ${n.length} `
  });
});

module.exports = router;
