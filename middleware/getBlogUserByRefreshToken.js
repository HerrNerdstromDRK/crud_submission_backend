const BlogUser = require("../models/BlogUserModel");

/**
 * Search for a user by the given refreshtoken in req.body.refreshToken.
 * If found, store the user in res.blogUser.
 * If not found, set status 404.
 * @param {}
 * @returns
 */
const getBlogUserByRefreshToken = async (req, res) => {
  console.log(
    "getBlogUserByRefreshToken> req.body.refreshToken: " + req.body.refreshToken
  );

  let blogUser = null;
  try {
    blogUser = await BlogUser.findOne({
      userName: req.body.refreshToken,
    }).exec();
    console.log("getBlogUserByRefreshToken> blogUser: " + blogUser);
  } catch (err) {
    console.log("getBlogUserByRefreshToken> error in findOne()");
    return res.status(500).json({ message: err.message });
  }
  res.blogUser = blogUser;
  next();
};

module.exports = getBlogUserByRefreshToken;
