const jwt = require("jsonwebtoken");
require("dotenv");

/**
 * Middleware to be used to verify a user is logged in.
 * @param {} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const verifyJWT = (req, res, next) => {
  const authHeader = req.header["authorization"];
  if (!authHeader) {
    return res.sendStatus(401);
  }
  console.log("verifyJWT> authHeader: ");
  console.log(authHeader); // Bearer token

  // Retrieve the token value
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // invalid token
    }
    req.userName = decoded.userName;
    next();
  });
};

module.exports = verifyJWT;
