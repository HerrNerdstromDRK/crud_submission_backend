/**
 * Handle all routes that begin with /blogusers
 */
const express = require("express");
const router = express.Router();
const BlogUser = require("../models/BlogUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getBlogUser = require("../middleware/getBlogUser");
const getBlogUserByUserName = require("../middleware/getBlogUserByUserName");
const authController = require("../controllers/authController");
const registerController = require("../controllers/registerController");
const refreshTokenController = require("../controllers/refreshTokenController");
const handleLogoutController = require("../controllers/logoutController");

require("dotenv").config();

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

/**
 * Route to handle refresh token requests to provide a new access token.
 * Learned this the hard way: Make sure the specific get() routes occur before
 * any get routes with :id.
 */
router.get("/refresh", refreshTokenController.handleRefreshToken);

/**
 * Add a route to logout the user, which basically just clears the refresh token.
 */
router.get("/logout", handleLogoutController.handleLogout);

/**
 * Retrieve a single blogUser by id.
 * // Use the getBlogUser middleware
 */
router.get("/:id", getBlogUser, (req, res) => {
  res.send(res.blogUser);
});

/*
 * Create a new user and add it to the database.
 * Will verify that no duplicate userName exists first by calling
 * the getBlogUserByUserName middleware.
 * If a duplicate userName exists, this function will return
 * an error to the caller.
 */
router.post(
  "/register",
  getBlogUserByUserName,
  registerController.handleRegister
);

/**
 * Since the authenticate route code will be used several times, use it
 * from a separate authController. Note that this call still includes a
 * middleware call to getBlogUserByUserName.
 */
router.post("/authenticate", getBlogUserByUserName, authController.handleLogin);

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

module.exports = router;
