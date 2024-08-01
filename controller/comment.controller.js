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
    if (!post_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          resError(ERROR_CONSTANT.POST_ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
        );
    }
    const commentValidation = commentValidator(req.body);
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

async function updateComment(req, res) {
  try {
    const { comment_id } = req.params;
    const { content } = req.body;
    if (!comment_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
        );
    }
    const commentValidation = commentValidator(req.body);
    if (commentValidation.status) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(resError(commentValidation.error, STATUS_CODES.BAD_REQUEST));
    }
    const updateComments = await Comment.findByIdAndUpdate(comment_id, {
      content,
    });
    if (updateComments) {
      return res
        .status(STATUS_CODES.CREATED)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.COMMENT_UPDATED,
            STATUS_CODES.CREATED,
            updateComments
          )
        );
    } else {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_INVALID, STATUS_CODES.SUCCESS)
        );
    }
  } catch (err) {}
}

async function getCommentById(req, res) {
  try {
    const { comment_id } = req.params;
    if (!comment_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
        );
    }
    const findComment = await Comment.findOne({ _id: comment_id }).populate(
      "user_id",
      "username"
    );
    if (findComment) {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.COMMENT_GET,
            STATUS_CODES.SUCCESS,
            findComment
          )
        );
    } else {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_INVALID, STATUS_CODES.SUCCESS)
        );
    }
  } catch (err) {}
}

async function getAllComments(req, res) {
  try {
    const { post_id } = req.query;
    if (!post_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          resError(ERROR_CONSTANT.POST_ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
        );
    }
    const findAllComment = await Comment.find({ post_id }).populate(
      "user_id",
      "username"
    );
    if (findAllComment) {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.COMMENT_ALL_GET,
            STATUS_CODES.SUCCESS,
            findAllComment
          )
        );
    } else {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(resError(ERROR_CONSTANT.POST_ID_INVALID, STATUS_CODES.SUCCESS));
    }
  } catch (err) {}
}

async function deleteCommentById(req, res) {
  try {
    const { comment_id } = req.params;
    if (!comment_id) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_REQUIRED, STATUS_CODES.BAD_REQUEST)
        );
    }
    const userDetail = req.headers.user;

    const findAndDeleteComment = await Comment.deleteOne({
      _id: comment_id,
      user_id: userDetail.user_id,
    });
    if (findAndDeleteComment.deletedCount === 0) {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resError(ERROR_CONSTANT.COMMENT_ID_INVALID, STATUS_CODES.SUCCESS)
        );
    }
    await Post.updateOne(
      { comments: comment_id },
      { $pull: { comments: comment_id } }
    );
    return res
      .status(STATUS_CODES.SUCCESS)
      .send(resSuccess(SUCCESS_CONSTANT.COMMENT_DELETE, STATUS_CODES.SUCCESS));
  } catch (err) {
    console.log("error", err);
  }
}

module.exports = {
  createComment,
  updateComment,
  getCommentById,
  getAllComments,
  deleteCommentById,
};
