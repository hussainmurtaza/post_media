const jwt = require('jsonwebtoken');
const STATUS_CODES = require('../constant/statusCode.constant');
const { resError } = require('../utils/response');
const ERROR_CONSTANT = require('../constant/error.constant');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(resError(ERROR_CONSTANT.TOKEN_REQUIRED, STATUS_CODES.UNAUTHORIZED))
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(STATUS_CODES.UNAUTHORIZED).send(resError(ERROR_CONSTANT.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED))
    }
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(STATUS_CODES.UNAUTHORIZED).send(resError(ERROR_CONSTANT.INVALID_TOKEN, STATUS_CODES.UNAUTHORIZED))
        }
        req.body.user = decoded.user
        next()
    })
}

module.exports = verifyToken;