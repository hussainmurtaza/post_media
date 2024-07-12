const STATUS_CODES = require('../constant/statusCode.constant')
const { resError, resSuccess } = require('../utils/response')
const postValidator = require('../validator/post.validator')
const Post = require('../model/post.model')
const SUCCESS_CONSTANT = require('../constant/success.constant')

async function createPost(req, res) {
    const postValidation = postValidator(req.body)
    if (postValidation.status) {
        return res.status(STATUS_CODES.BAD_REQUEST).send(resError(postValidation.error, STATUS_CODES.BAD_REQUEST))
    }
    const { user_id } = req.body.user;
    const { content, img_url } = req.body;
    const createPost = await Post.create({ user_id, content, img_url })
    if (createPost) {
        return res.status(STATUS_CODES.CREATED).send(resSuccess(SUCCESS_CONSTANT.POST_CREATED, STATUS_CODES.CREATED, createPost));
    }
    console.log("post body", user_id, content, img_url)
}

module.exports = { createPost }