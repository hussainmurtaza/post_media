const ERROR_CONSTANT = require("../constant/error.constant");

const refreshTokeValidator = (body) => {
  let error = {
    status: false,
    error: "",
  };
  if (!body.refresh_token) {
    error.error = ERROR_CONSTANT.REFRESH_TOKEN_REQUIRED;
    error.status = true;
    return error;
  }
  return error;
};

module.exports = refreshTokeValidator;
