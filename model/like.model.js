const mongoose = require("mongoose");

const likeSchema = mongoose.Schema({
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
});

const Like = mongoose.model("like", likeSchema);
module.exports = Like;
