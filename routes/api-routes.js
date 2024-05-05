const express = require("express")
const router = express.Router()

const { getAllApis } = require("../controllers/api-controller");

router.get("/api", getAllApis);

module.exports = router