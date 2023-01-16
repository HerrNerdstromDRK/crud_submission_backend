const BlogUser = require("../models/BlogUserModel");

/**
 * Middleware to find a blog user.
 * Add the user as res.blogUser.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getBlogUser = async (req, res, next) => {
  let blogUser;
  try {
    blogUser = await BlogUser.findById(req.params.id);
    if (blogUser == null) {
      return res.status(404).json({ message: "Cannot find blog user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blogUser = blogUser;
  next();
};

module.exports = getBlogUser;
