const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * Authenticate a user.
 * The getBlogUserByUserName middleware is called prior to invoking this
 * function.
 *
 * JSON Web Token Strategy:
 * - Access token:
 * -- Sent as JSON
 * -- Client stores in memory
 * -- Do NOT store in local storage or cookies
 * -- Short duration
 * -- Issued at authorization
 * -- Client uses for API access until expires
 * -- Verified with middleware
 * -- New token issued at refresh request
 * - Refresh token:
 * -- Sent as httpOnly cookie
 * -- Not accessible via JavaScript
 * -- Must have expiry at some point requiring user to login again
 * -- Issued at authorization
 * -- Client uses to requst new access token
 * -- Verified with endpoint and database
 * -- Must be allowed to expire or logout
 */
const handleLogin = async (req, res) => {
  const { userName, pwd } = req.body;
  if (!userName || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  console.log(
    "authController.handleLogin> userName: " + userName + ", pwd: " + pwd
  );

  try {
    // Retrieve the existing blog user from the middleware, if it exists.
    const existingBlogUser = res.blogUser;
    //    console.log(
    //      "authController.handleLogin> existingBlogUser: " +
    //        JSON.stringify(existingBlogUser)
    //    );
    if (!existingBlogUser) {
      // Unable to locate the user for a login attempt
      return res
        .status(401)
        .json({ message: "User not found: " + req.body.userName });
    }
    // Post condition: User found

    // Check if passwords match
    const match = await bcrypt.compare(pwd, existingBlogUser.hashedPassword);
    //    console.log(
    //      "authController.handleLogin> pwd: " + pwd + ", match: " + match
    //    );
    if (match) {
      // hashed passwords match

      // Create JWTs
      //      console.log(
      //        "authController.handleLogin> Going to jwt.sign for ACCESS_TOKEN"
      //      );
      const accessToken = jwt.sign(
        { userName: userName },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "30s" } // TODO: Update for production
      );
      //      console.log(
      //        "authController.handleLogin> Going to jwt.sign for REFRESH_TOKEN"
      //      );
      const refreshToken = jwt.sign(
        { userName: userName },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // Save refresh token with current user
      existingBlogUser.refreshToken = refreshToken;
      const updatedExistingBlogUser = await existingBlogUser.save();
      //      console.log(
      //        "authController.handleLogin> updatedExistingBlogUser: " +
      //          JSON.stringify(existingBlogUser)
      //      );

      // Send the refreshToken to the user
      // Store as http only since it is not available to javascript
      // Allow it to live for 1 day (in milliseconds)
      res.cookie("jwt", refreshToken, {
        httpOnly: true, // sameSite: "None", secure: true TODO: other controllers also
        maxAge: 24 * 60 * 60 * 1000,
      });

      // Send the accessToken to the user, to be kept only in memory
      return res.status(201).json({ accessToken });
    }
    // Post condition: passwords do not match
    return res
      .status(401)
      .json({ message: "Login failed for user " + req.body.userName });
  } catch (err) {
    // Server error
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleLogin };
