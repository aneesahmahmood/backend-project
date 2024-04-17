const express = require("express");
const { getAllTopics } = require("./controllers/topics-controllers");
const { getAllApis } = require("./controllers/api-controller");
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
} = require("./controllers/article-controller");
const app = express();

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api", getAllApis);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found!" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ msg: "not found!" });
  }
});

module.exports = app;
