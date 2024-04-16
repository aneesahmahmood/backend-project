const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  checkArticleExists,
} = require("../models/article-models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    checkArticleExists(article_id)
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};