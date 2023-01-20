/**
 * Handle all routes that begin with /inventoryitemuser
 */
const express = require("express");
const router = express.Router();
const inventoryItemUser = require("../models/InventoryItemUserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const getInventoryItemUser = require("../middleware/getInventoryItemUser");
const getInventoryItemUserByUserName = require("../middleware/getInventoryItemUserByUserName");
const authController = require("../controllers/authController");
const registerController = require("../controllers/registerController");
const refreshTokenController = require("../controllers/refreshTokenController");
const handleLogoutController = require("../controllers/logoutController");

require("dotenv").config();

/**
 * Get all users.
 */
router.get("/", async (req, res) => {
  console.log("inventoryitemusers.get(/)");
  try {
    const inventoryItemUsers = await inventoryItemUser.find();
    res.json(inventoryItemUsers);
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
{
  console.log("inventoryitemusers.get(/refresh)");
}

/**
 * Add a route to logout the user, which basically just clears the refresh token.
 */
router.get("/logout", handleLogoutController.handleLogout);
{
  console.log("inventoryitemusers.get(/logout)");
}

/**
 * Retrieve a single inventoryItemUser by id.
 * Uses the getInventoryItemUser middleware.
 */
router.get("/:id", getInventoryItemUser, (req, res) => {
  console.log("inventoryitemusers.get(/:id)");
  res.send(res.inventoryItemUser);
});

/*
 * Create a new user and add it to the database.
 * Will verify that no duplicate userName exists first by calling
 * the getInventoryItemUserByUserName middleware.
 * If a duplicate userName exists, this function will return
 * an error to the caller.
 */
router.post(
  "/register",
  getInventoryItemUserByUserName,
  registerController.handleRegister
);
{
  console.log("inventoryitemusers.post(/register)");
}

/**
 * Since the authenticate route code will be used several times, use it
 * from a separate authController. Note that this call still includes a
 * middleware call to getInventoryItemUserByUserName.
 */
router.post(
  "/authenticate",
  getInventoryItemUserByUserName,
  authController.handleLogin
);
{
  console.log("inventoryitemusers.post(/authenticate)");
}

/**
 * Update a user's information, but only the items that have changed.
 */
router.patch("/:id", getInventoryItemUser, async (req, res) => {
  console.log("inventoryitemusers.patch(/:id)");
  if (req.body.firstName != null) {
    res.inventoryItemUser.firstName = req.body.firstName;
  }
  if (req.body.lastName != null) {
    res.inventoryItemUser.lastName = req.body.lastName;
  }
  if (req.body.userName != null) {
    res.inventoryItemUser.userName = req.body.userName;
  }
  if (req.body.hashedPassword != null) {
    res.inventoryItemUser.hashedPassword = req.body.hashedPassword;
  }
  try {
    const updatedinventoryItemUser = await res.inventoryItemUser.save();
    res.json(updatedinventoryItemUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a user.
 */
router.delete("/:id", getInventoryItemUser, async (req, res) => {
  console.log("inventoryitemusers.delete(/:id)");
  try {
    await res.inventoryItemUser.remove();
    res.json({ message: "Deleted inventory item user" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
