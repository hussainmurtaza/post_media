const emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const ERROR_CONSTANT = require('../constant/error.constant');
const emailValidator = (email) => {
    if (!email) return { isValid: false, message: ERROR_CONSTANT.EMAIL_REQUIRED }
    if (email.length > 254) return { isValid: false, message: ERROR_CONSTANT.EMAIL_NOT_VALID }
    if (!emailRegex.test(email)) return { isValid: false, message: ERROR_CONSTANT.EMAIL_NOT_VALID }
    return {isValid:true};
}

module.exports = emailValidator;