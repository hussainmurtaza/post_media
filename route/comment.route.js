const express = require("express");
const { createComment } = require("../controller/comment.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/:post_id", verifyToken, createComment);

module.exports = router;
