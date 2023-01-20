const InventoryItemUser = require("../models/InventoryItemUserModel");

/**
 * Search for a user by the given refreshtoken in req.body.refreshToken.
 * If found, store the user in res.inventoryItemUser.
 * If not found, set status 404.
 * @param {}
 * @returns
 */
const getInventoryItemUserByRefreshToken = async (req, res) => {
  console.log(
    "getInventoryItemUserByRefreshToken> req.body.refreshToken: " +
      req.body.refreshToken
  );

  let inventoryItemUser = null;
  try {
    inventoryItemUser = await InventoryItemUser.findOne({
      userName: req.body.refreshToken,
    }).exec();
    console.log(
      "getInventoryItemUserByRefreshToken> inventoryItemUser: " +
        inventoryItemUser
    );
  } catch (err) {
    console.log("getInventoryItemUserByRefreshToken> error in findOne()");
    return res.status(500).json({ message: err.message });
  }
  res.inventoryItemUser = inventoryItemUser;
  next();
};

module.exports = getInventoryItemUserByRefreshToken;
