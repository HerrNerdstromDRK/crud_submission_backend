const BlogUser = require("../models/BlogUserModel");

/**
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
const handleLogout = async (req, res) => {
  // TODO: On client, also delete accessToken

  //  console.log("handleLogout");
  // Retrieve the cookies and check for a JWT
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    // No content to send back
    return res.sendStatus(204);
  }
  // Post condition: Found JWT
  const refreshToken = cookies.jwt;
  console.log("handleLogout> refreshToken: " + refreshToken);

  // Retrieve the existing blog user, if it exists.
  const existingBlogUser = await BlogUser.findOne({ refreshToken });
  console.log(
    "handleLogout> existingBlogUser: " + JSON.stringify(existingBlogUser)
  );
  if (!existingBlogUser) {
    // Unable to locate the user for a login attempt
    // Erase the cookie identified as "jwt"
    res.clearCookie("jwt", { httpOnly: true });
    console.log(
      "handleLogout> Unable to find user by refresh token: " + refreshToken
    );
    return res.sendStatus(204); // Successful but no content
  }
  // Post condition: User found

  // Delete refresh token from db
  existingBlogUser.refreshToken = "";
  await existingBlogUser.save();

  // Clear the cookie
  res.clearCookie("jwt", { httpOnly: true });
  // Send back the user with token cleared
  // NOTE: Only for dev since this will send the hashed password also.
  res.status(200).json({ existingBlogUser });
};

module.exports = { handleLogout };
