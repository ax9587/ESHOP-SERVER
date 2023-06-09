// create token and saving that in cookies
const sendToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    Secure: true,
    SameSite: 'none',
    maxAge: 1000 * 60 * 60 * 60
  };

  res.status(statusCode).cookie("user_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendToken;
