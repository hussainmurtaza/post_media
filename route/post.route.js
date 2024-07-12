const express = require('express');
const {createPost} = require('../controller/post.controller');
const verifyToken = require('../middleware/auth.middleware')
const router = express.Router();

router.post('/', verifyToken, createPost);

module.exports = router