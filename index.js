require("dotenv").config();
const express = require("express");
const authenticationRoute = require("./route/authentication.route");
const postRoute = require("./route/post.route");
const commentRoute = require("./route/comment.route");
const likeRoute = require("./route/like.route");
const connectDB = require("./database/config");
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());

// connect mongoDB
connectDB();

// authentication routes
app.use("/", authenticationRoute);

// posts routes
app.use("/post", postRoute);

// comments routes
app.use("/comment", commentRoute);

// likes routes
app.use("/like", likeRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
