const express = require("express")
const router = express.Router()
const { deleteComment } = require("../controllers/comments-controller");

router.delete("/:comment_id", deleteComment);

module.exports = router;
