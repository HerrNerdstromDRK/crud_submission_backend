const jwt = require("jsonwebtoken");
require("dotenv").config();
const BlogUser = require("../models/InventoryItemUserModel");

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
const handleRefreshToken = async (req, res) => {
  //  console.log("handleRefreshToken");
  // Retrieve the cookies and check for a JWT
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("handleRefreshToken> No JWT token available");
    return res.status(401);
  }
  // Post condition: Found JWT
  const refreshToken = cookies.jwt;
  console.log(
    "refreshTokenController.handleRefreshToken> refreshToken: " + refreshToken
  );

  // Retrieve the existing inventory user, if it exists.
  const existingInventoryItemUser = await InventoryItemUser.findOne({
    refreshToken,
  }).exec();
  //  console.log(
  //    "refreshTokenController.handleRefreshToken> existingInventoryItemUser: " +
  //      JSON.stringify(existingInventoryItemUser)
  //  );
  if (!existingInventoryItemUser) {
    // Unable to locate the user for a login attempt
    console.log(
      "refreshTokenController.handleRefreshToken> Unable to find user by refresh token: " +
        refreshToken
    );
    return res.sendStatus(403); // Forbidden
  }
  // Post condition: User found

  // Evaluate JWT
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    // Callback for verify
    // Check for any error or if the wrong user was returned
    if (err || existingInventoryItemUser.userName !== decoded.userName) {
      return res.sendStatus(403);
    }
    const accessToken = jwt.sign(
      { userName: decoded.userName },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
