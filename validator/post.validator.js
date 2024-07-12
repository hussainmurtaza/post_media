const ERROR_CONSTANT = require('../constant/error.constant')

const postValidator = (body) => {

    let error = {
        status: false,
        error: ''
    }
    if (!body.content) {
        error.error = ERROR_CONSTANT.CONTENT_REQUIRED
        error.status = true
        return error
    } return error

}

module.exports = postValidator