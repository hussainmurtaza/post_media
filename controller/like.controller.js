const STATUS_CODES = require("../constant/statusCode.constant");
const SUCCESS_CONSTANT = require("../constant/success.constant");
const Like = require("../model/like.model");
const Post = require("../model/post.model");
const { resError, resSuccess } = require("../utils/response");
const likeValidator = require("../validator/like.validator");

async function createLike(req, res) {
  const { post_id } = req.params;
  const { user_id } = req.headers.user;
  const likeValidation = likeValidator({ post_id });
  if (likeValidation.status) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send(resError(likeValidation.error, STATUS_CODES.BAD_REQUEST));
  }
  const exsistingLike = await Like.findOne({ user_id, post_id });
  if (exsistingLike) {
    await Like.deleteOne({ user_id });
    await Post.findByIdAndUpdate(post_id, { $pull: { likes: user_id } });
  } else {
    await Like.create({ post_id, user_id });
    await Post.findByIdAndUpdate(
      post_id,
      { $addToSet: { likes: user_id } },
      { new: true, useFindAndModify: false }
    );
  }
  const updatedPost = await Post.findOne({ _id: post_id })
    .populate({
      path: "comments",
      populate: { path: "user_id", select: "username" },
    })
    .populate("likes", "username");
  return res
    .status(STATUS_CODES.CREATED)
    .send(
      resSuccess(
        exsistingLike
          ? SUCCESS_CONSTANT.LIKE_REMOVE
          : SUCCESS_CONSTANT.LIKE_ADD,
        STATUS_CODES.CREATED,
        updatedPost
      )
    );
}

module.exports = { createLike };
