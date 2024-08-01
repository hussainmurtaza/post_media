const express = require("express");
const {
  createPost,
  getAllPost,
  getPostByUser,
} = require("../controller/post.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = express.Router();

router.get("/", getAllPost);
router.post("/", verifyToken, createPost);
router.get("/:user_id", verifyToken, getPostByUser);

module.exports = router;
