const express = require("express");
const { getAllTopics } = require("./controllers/topics-controllers");
const { getAllApis } = require("./controllers/api-controller");
const app = express();

app.get("/api/topics", getAllTopics);

app.get("/api", getAllApis);

app.all("/*", (req, res, next) => {
  res.status(404).send({ msg: "Not found!" });
});

module.exports = app;
