const express = require("express")
const router = express.Router()
const { getAllTopics } = require("../controllers/topics-controllers");

router.get("/", getAllTopics);

module.exports = router;
