const STATUS_CODES = require("../constant/statusCode.constant");
const { resError, resSuccess } = require("../utils/response");
const commentValidator = require("../validator/comment.validator");
const Comment = require("../model/comment.model");
const Post = require("../model/post.model");
const SUCCESS_CONSTANT = require("../constant/success.constant");
const ERROR_CONSTANT = require("../constant/error.constant");

async function createComment(req, res) {
  try {
    const { post_id } = req.params;
    const commentValidation = commentValidator({ ...req.body, post_id });
    if (commentValidation.status) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(resError(commentValidation.error, STATUS_CODES.BAD_REQUEST));
    }
    const { user_id } = req.headers.user;
    const { content } = req.body;
    const findPost = await Post.findOne({ _id: post_id });
    if (findPost) {
      const createComment = await Comment.create({ user_id, content, post_id });
      if (createComment) {
        const updatePostSchemaForComment = await Post.findByIdAndUpdate(
          post_id,
          { $push: { comments: createComment._id } }
        );
        if (updatePostSchemaForComment) {
          return res
            .status(STATUS_CODES.CREATED)
            .send(
              resSuccess(
                SUCCESS_CONSTANT.COMMENT_CREATED,
                STATUS_CODES.CREATED,
                createComment
              )
            );
        }
      }
    } else {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(resError(ERROR_CONSTANT.POST_ID_INVALID, STATUS_CODES.SUCCESS));
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = { createComment };
