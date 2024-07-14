const ERROR_CONSTANT = require("../constant/error.constant");
const emailValidator = require("./email.validator");

const registerValidator = (body) => {
  let error = {
    status: false,
    error: "",
  };
  const emailValidation = emailValidator(body.email);
  if (!body.first_name) {
    error.error = ERROR_CONSTANT.FIRST_NAME_REQUIRED;
    error.status = true;
    return error;
  }
  if (!body.last_name) {
    error.error = ERROR_CONSTANT.LAST_NAME_REQUIRED;
    error.status = true;
    return error;
  }
  if (!body.username) {
    error.error = ERROR_CONSTANT.USERNAME_REQUIRED;
    error.status = true;
    return error;
  }
  if (!body.date_of_birth) {
    error.error = ERROR_CONSTANT.DOB_REQUIRED;
    error.status = true;
    return error;
  }
  if (!emailValidation.isValid) {
    error.error = emailValidation.message;
    error.status = true;
    return error;
  }
  if (!body.password) {
    error.error = ERROR_CONSTANT.PASSWORD_REQUIRED;
    error.status = true;
    return error;
  }
  if (body.password.length < 6) {
    error.error = ERROR_CONSTANT.PASSWORD_TOO_SHORT;
    error.status = true;
    return error;
  }
  return error;
};

module.exports = registerValidator;
