const express = require("express")
const router = express.Router()
const {
  getArticleById,
  getAllArticles,
  getCommentsByArticleId,
  postComment,
  patchVotes,
} = require("../controllers/article-controller");

router.get("/api/articles/:article_id", getArticleById);
router.get("/", getAllArticles);
router.get("/:article_id/comments", getCommentsByArticleId);
router.post("/:article_id/comments", postComment);
router.patch("/:article_id", patchVotes);

module.exports = router;
