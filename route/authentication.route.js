const express = require("express");
const { register, login, refreshToken } = require("../controller/authentication.controller");
const router = express.Router();

router.post("/signup", register);
router.post("/signin", login);
router.post("/refresh-token", refreshToken);

module.exports = router;
