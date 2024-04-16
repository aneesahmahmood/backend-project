const express = require("express");
const { getAllTopics } = require("./controllers/topics-controllers");
const { getAllApis } = require("./controllers/api-controller");
const { getArticleById } = require("./controllers/article-controller");
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api/articles/:article_id", getArticleById);
app.get("/api", getAllApis);

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
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  }
  next(err);
});

module.exports = app;
