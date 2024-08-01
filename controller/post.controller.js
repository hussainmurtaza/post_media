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
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const findAllPost = await Post.find()
      .populate("user_id", "username") // Populate user_id with username
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "username",
        },
      })
      .populate("likes", "username")
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments();
    if (findAllPost) {
      return res.status(STATUS_CODES.SUCCESS).send(
        resSuccess(SUCCESS_CONSTANT.POST_GET, STATUS_CODES.SUCCESS, {
          count: totalPosts,
          limit,
          page,
          findAllPost,
        })
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

async function getPostByUser(req, res) {
  const { user_id } = req.params;
  console.log("user id", user_id);
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const findAllPost = await Post.find({ user_id })
      .populate("user_id", "username") // Populate user_id with username
      .populate({
        path: "comments",
        populate: {
          path: "user_id",
          select: "username",
        },
      })
      .populate("likes", "username")
      .skip(skip)
      .limit(limit);
    const totalPosts = await Post.countDocuments({ user_id });
    if (findAllPost) {
      return res.status(STATUS_CODES.SUCCESS).send(
        resSuccess(SUCCESS_CONSTANT.POST_GET, STATUS_CODES.SUCCESS, {
          count: totalPosts,
          limit,
          page,
          findAllPost,
        })
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

module.exports = { createPost, getAllPost, getPostByUser };
