/**
 * Handle all routes that begin with /blogusers
 */
const express = require("express");
const router = express.Router();
const BlogUser = require("../models/BlogUserModel");

// Get all
router.get("/", async (req, res) => {
  try {
    const blogUsers = await BlogUser.find();
    res.json(blogUsers);
  } catch (err) {
    // 500 is server error code
    res.status(500).json({ message: err.message });
  }
});

// Get one
router.get("/:id", getBlogUser, (req, res) => {
  res.send(res.blogUser);
});

/*
 * Create a new user and add it to the database.
 * Will verify that no duplicate userName exists first by calling
 * the getBlogUserByUserName middleware.
 * If a duplicate userName exists, this function will return
 * an error to the caller.
 * Precondition: This API is only passed already hashed passwords to
 * prevent sending cleartext passwords across any link.
 */
router.post("/", getBlogUserByUserName, async (req, res) => {
  try {
    // Retrieve the existing blog user from the middleware, if it exists.
    const existingBlogUser = res.blogUser;
    if (existingBlogUser) {
      console.log(
        "blogusers.post> existingBlogUser: " + JSON.stringify(existingBlogUser)
      );
      return res.status(400).json({ message: "User name already exists" });
    }
    // Post condition: userName is not already in the database.
    // Create a new blogUser to add to the database
    const blogUser = new BlogUser({
      // _id is auto-filled by mongoDB
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      hashedPassword: req.body.hashedPassword,
    });
    console.log(
      "blogusers.post> Creating new user: " + JSON.stringify(blogUser)
    );

    // Save the new user into the database
    const newBlogUser = blogUser.save();

    // 201: Successfully created object
    res.status(201).send(blogUser);
  } catch (err) {
    console.log("blogusers.post> Caught error: " + err.message);
    // 400 bad data
    res.status(400).json({ message: err.message });
  }
});

// Update only updated data
router.patch("/:id", getBlogUser, async (req, res) => {
  if (req.body.firstName != null) {
    res.blogUser.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.blogUser.lastName = req.body.lastName;
  }
  if (req.body.userName != null) {
    res.blogUser.userName = req.body.userName;
  }
  if (req.body.hashedPassword != null) {
    res.blogUser.hashedPassword = req.body.hashedPassword;
  }
  try {
    const updatedBlogUser = await res.blogUser.save();
    res.json(updatedBlogUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete one
router.delete("/:id", getBlogUser, async (req, res) => {
  try {
    await res.blogUser.remove();
    res.json({ message: "Deleted blog user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Middleware to find a blog user.
 * Add the user as res.blogUser.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getBlogUser(req, res, next) {
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
}

/**
 * Search for a user by the given username in req.body.userName.
 * If found, store the user in res.blogUser.
 * If not found, set status 404.
 * @param {} findMeUserName
 * @returns
 */
async function getBlogUserByUserName(req, res, next) {
  let blogUser = null;

  //  console.log("getBlogUserByUserName> req.body.userName: " + req.body.userName);

  try {
    blogUser = await BlogUser.findOne({ userName: req.body.userName });
    //    console.log("getBlogUserByUserName> blogUser: " + blogUser);
    // Do NOT set a status here since I still need to execute the
    // code in the body of the next() function
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.blogUser = blogUser;
  next();
}

module.exports = router;
