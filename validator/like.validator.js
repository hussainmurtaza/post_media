const ERROR_CONSTANT = require("../constant/error.constant");

const likeValidator = (body) => {
  let error = {
    status: false,
    error: "",
  };
  if (!body.post_id) {
    error.error = ERROR_CONSTANT.POST_ID_REQUIRED;
    error.status = true;
    return error;
  }
  return error;
};

module.exports = likeValidator;
