const BlogUser = require("../models/BlogUserModel");

/**
 * Search for a user by the given username in req.body.userName.
 * If found, store the user in res.blogUser.
 * If not found, set status 404.
 * @param {}
 * @returns
 */
const getBlogUserByUserName = async (req, res, next) => {
  //  console.log("getBlogUserByUserName> req.body.userName: " + req.body.userName);

  let blogUser = null;
  try {
    blogUser = await BlogUser.findOne({ userName: req.body.userName }).exec();
    console.log("getBlogUserByUserName> blogUser: " + blogUser);
    // Do NOT set a status here since I still need to execute the
    // code in the body of the next() function
  } catch (err) {
    console.log("getBlogUserByUserName> error in findOne()");
    return res.status(500).json({ message: err.message });
  }
  res.blogUser = blogUser;
  next();
};

module.exports = getBlogUserByUserName;
