const STATUS_CODES = require("../constant/statusCode.constant");
const { resError, resSuccess } = require("../utils/response");
const postValidator = require("../validator/post.validator");
const Post = require("../model/post.model");
const SUCCESS_CONSTANT = require("../constant/success.constant");
const ERROR_CONSTANT = require("../constant/error.constant");

async function createPost(req, res) {
  try {
    const postValidation = postValidator(req.body);
    if (postValidation.status) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(resError(postValidation.error, STATUS_CODES.BAD_REQUEST));
    }
    const { user_id } = req.headers.user;
    const { content, img_url } = req.body;
    const createPost = await Post.create({ user_id, content, img_url });
    if (createPost) {
      return res
        .status(STATUS_CODES.CREATED)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.POST_CREATED,
            STATUS_CODES.CREATED,
            createPost
          )
        );
    }
  } catch (err) {
    console.log(err);
  }
}

async function getAllPost(req, res) {
  try {
    const findAllPost = await Post.find()
      .populate("user_id", "username") // Populate user_id with username
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "username",
        },
      })
      .populate("likes", "username");
    if (findAllPost) {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.POST_GET,
            STATUS_CODES.SUCCESS,
            findAllPost
          )
        );
    } else {
      return res
        .status(STATUS_CODES.SUCCESS)
        .send(
          resSuccess(
            ERROR_CONSTANT.POST_ID_INVALID,
            STATUS_CODES.SUCCESS,
            findAllPost
          )
        );
    }
  } catch (error) {
    console.log("error", error);
  }
}

module.exports = { createPost, getAllPost };
