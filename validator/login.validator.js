const ERROR_CONSTANT = require("../constant/error.constant");

const loginValidator = (body) => {
  let error = {
    status: false,
    error: "",
  };
  if (!body.username) {
    error.error = ERROR_CONSTANT.USERNAME_REQUIRED;
    error.status = true;
    return error;
  }
  if (!body.password) {
    error.error = ERROR_CONSTANT.PASSWORD_REQUIRED;
    error.status = true;
    return error;
  }
  return error;
};

module.exports = loginValidator;
