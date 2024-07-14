const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  content: { type: String, required: true },
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

const Comment = mongoose.model("comment", commentSchema);
module.exports = Comment;
