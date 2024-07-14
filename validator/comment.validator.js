const ERROR_CONSTANT = require("../constant/error.constant");

const commentValidator = (body) => {
  let error = {
    status: false,
    error: "",
  };
  if (!body.content) {
    error.error = ERROR_CONSTANT.CONTENT_REQUIRED;
    error.status = true;
    return error;
  }
  if (!body.post_id) {
    error.error = ERROR_CONSTANT.POST_ID_REQUIRED;
    error.status = true;
    return error;
  }
  return error;
};

module.exports = commentValidator;
