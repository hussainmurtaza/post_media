const express = require("express");
const { createLike } = require("../controller/like.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/:post_id", verifyToken, createLike);

module.exports = router;
