const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: "1d",
  });
  const refreshToken = jwt.sign(
    { user },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};
module.exports = generateToken;
