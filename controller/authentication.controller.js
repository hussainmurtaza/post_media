const RegistrationValidation = require("../validator/registration.validator");
const LoginValidation = require("../validator/login.validator");
const RefreshTokenValidation = require("../validator/refreshToken.validator");
const { resError, resSuccess } = require("../utils/response");
const STATUS_CODES = require("../constant/statusCode.constant");
const User = require("../model/user.model");
const ERROR_CONSTANT = require("../constant/error.constant");
const SUCCESS_CONSTANT = require("../constant/success.constant");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  try {
    const validationResponse = RegistrationValidation(req.body);
    if (validationResponse.status) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(resError(validationResponse.error, STATUS_CODES.BAD_REQUEST));
    }
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return res
          .status(STATUS_CODES.ALREADY_EXSITS)
          .send(
            resError(ERROR_CONSTANT.EMAIL_EXSITS, STATUS_CODES.ALREADY_EXSITS)
          );
      }
      if (existingUser.username === username) {
        return res
          .status(STATUS_CODES.ALREADY_EXSITS)
          .send(
            resError(
              ERROR_CONSTANT.USERNAME_EXSITS,
              STATUS_CODES.ALREADY_EXSITS
            )
          );
      }
    }
    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUND)
    );
    req.body.password = hashedPassword;
    const newUser = await User.create(req.body);
    if (newUser) {
      return res
        .status(STATUS_CODES.CREATED)
        .send(
          resSuccess(
            SUCCESS_CONSTANT.USER_CREATED,
            STATUS_CODES.CREATED,
            newUser
          )
        );
    }
  } catch (err) {}
}

async function login(req, res) {
  try {
    const validationResponse = LoginValidation(req.body);
    if (validationResponse.status) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .send(resError(validationResponse.error, STATUS_CODES.BAD_REQUEST));
    }
    const { username, password } = req.body;
    const findUser = await User.findOne({ username });
    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (isMatch) {
        const decodeData = {
          user_id: findUser._id,
          first_name: findUser.first_name,
          last_name: findUser.last_name,
          username: findUser.username,
          email: findUser.email,
          date_of_birth: findUser.date_of_birth,
        };
        const { access_token, refresh_token } = generateToken(decodeData);
        return res.status(STATUS_CODES.SUCCESS).send(
          resSuccess(SUCCESS_CONSTANT.USER_LOGGEDIN, STATUS_CODES.SUCCESS, {
            access_token,
            refresh_token,
          })
        );
      } else {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(
            resError(ERROR_CONSTANT.UNATHORIZED, STATUS_CODES.UNAUTHORIZED)
          );
      }
    } else {
      return res
        .status(STATUS_CODES.UNAUTHORIZED)
        .send(resError(ERROR_CONSTANT.UNATHORIZED, STATUS_CODES.UNAUTHORIZED));
    }
  } catch (err) {}
}

async function refreshToken(req, res) {
  const validationResponse = RefreshTokenValidation(req.body);
  if (validationResponse.status) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .send(resError(validationResponse.error, STATUS_CODES.BAD_REQUEST));
  }
  const { refresh_token } = req.body;
  jwt.verify(
    refresh_token,
    process.env.REFRESH_TOKEN_SECRET_KEY,
    (err, decoded) => {
      if (err) {
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send(
            resError(
              ERROR_CONSTANT.INVALID_REFRESH_TOKEN,
              STATUS_CODES.UNAUTHORIZED
            )
          );
      }
      const { access_token, refresh_token } = generateToken(decoded.user);
      return res.status(STATUS_CODES.SUCCESS).send(
        resSuccess(SUCCESS_CONSTANT.TOKEN_REFRESH, STATUS_CODES.SUCCESS, {
          access_token,
          refresh_token,
        })
      );
    }
  );
}

module.exports = { register, login, refreshToken };
