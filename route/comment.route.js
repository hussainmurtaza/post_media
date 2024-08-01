const express = require("express");
const {
  createComment,
  updateComment,
  getCommentById,
  getAllComments,
  deleteCommentById,
} = require("../controller/comment.controller");
const verifyToken = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/:post_id", verifyToken, createComment);
router.patch("/:comment_id", verifyToken, updateComment);
router.get("/:comment_id", verifyToken, getCommentById);
router.get("/", verifyToken, getAllComments);
router.delete("/:comment_id", verifyToken, deleteCommentById);

module.exports = router;
