const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const BlogUser = require("../models/BlogUserModel");

/*
 * Create a new user and add it to the database.
 * Will verify that no duplicate userName exists first by calling
 * the getBlogUserByUserName middleware.
 * If a duplicate userName exists, this function will return
 * an error to the caller.
 */
const handleRegister = async (req, res) => {
  const { userName, pwd } = req.body;
  console.log(
    "registerController.handleRegister> userName: " + userName + ", pwd: " + pwd
  );
  try {
    // Retrieve the existing blog user from the middleware, if it exists.
    const existingBlogUser = res.blogUser;
    if (existingBlogUser) {
      console.log(
        "registerController.handleRegister> existingBlogUser: " +
          JSON.stringify(existingBlogUser)
      );
      return res.status(409).json({ message: "User name already exists" });
    }
    // Post condition: user does not exist and existingBlogUser is null

    // hash with 10 salt rounds
    const hashedPassword = await bcrypt.hash(req.body.pwd, 10);

    // Create a new blogUser to add to the database
    const blogUser = new BlogUser({
      // _id is auto-filled by mongoDB
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      hashedPassword: hashedPassword,
    });
    console.log(
      "registerController.handleRegister> Creating new user: " +
        JSON.stringify(blogUser)
    );

    // Save the new user into the database
    const newBlogUser = blogUser.save();

    // 201: Successfully created object
    res.status(201).send(blogUser);
  } catch (err) {
    console.log(
      "registerController.handleRegister> Caught error: " + err.message
    );
    // 500 server error
    res.status(500).json({ message: err.message });
  }
};

// Export the handleRegister method
module.exports = { handleRegister };
