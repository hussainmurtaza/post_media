const express = require("express");
const { createPost, getAllPost } = require("../controller/post.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllPost);
router.post("/", verifyToken, createPost);

module.exports = router;
