const {
  selectArticleById,
  selectAllArticles,
  selectCommentsByArticleId,
  checkArticleExists,
  addComment,
  updateVotes,
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
  const { topic } = req.query;
  selectAllArticles(topic)
 
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  Promise.all([
    selectCommentsByArticleId(article_id),
    checkArticleExists(article_id),
  ])
    .then((response) => {
      const comments = response[0].rows;
      res.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  addComment(req.body, article_id)
    .then((response) => {
      const comment = response[0];
      res.status(201).send({ comment: comment });
    })
    .catch((error) => {
      next(error);
    });
};

exports.patchVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
