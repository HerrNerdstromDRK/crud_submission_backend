const InventoryItemUser = require("../models/InventoryItemUserModel");

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
  //  console.log("handleLogout");

  // Retrieve the cookies and check for a JWT
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    // No content to send back
    return res.sendStatus(204);
  }
  // Post condition: Found JWT
  const refreshToken = cookies.jwt;
  //  console.log("handleLogout> refreshToken: " + refreshToken);

  // Retrieve the existing inventory item user, if it exists.
  const existingInventoryItemUser = await InventoryItemUser.findOne({
    refreshToken,
  }).exec();
  //  console.log(
  //    "handleLogout> existingInventoryItemUser: " + JSON.stringify(existingInventoryItemUser)
  //  );
  if (!existingInventoryItemUser) {
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
  existingInventoryItemUser.refreshToken = "";
  //const result =
  await existingInventoryItemUser.save();
  //  console.log(
  //    "logoutController.handleLogout> Removed refresh token; result: " +
  //      JSON.stringify(result)
  //  );

  // Clear the cookie
  res.clearCookie("jwt", { httpOnly: true });
  // Send back the user with token cleared
  // NOTE: Only for dev since this will send the hashed password also.
  res.status(200).json({ existingInventoryItemUser });
};

module.exports = { handleLogout };
