const InventoryItemUser = require("../models/InventoryItemUserModel");

/**
 * Search for a user by the given username in req.body.userName.
 * If found, store the user in res.inventoryItemUser.
 * If not found, set status 404.
 * @param {}
 * @returns
 */
const getInventoryItemUserByUserName = async (req, res, next) => {
  console.log(
    "getInventoryItemUserByUserName> req.body.userName: " + req.body.userName
  );

  let inventoryItemUser = null;
  try {
    inventoryItemUser = await InventoryItemUser.findOne({
      userName: req.body.userName,
    }).exec();
    //    console.log("getInventoryItemUserByUserName> inventoryItemUser: " + inventoryItemUser);
    // Do NOT set a status here since I still need to execute the
    // code in the body of the next() function
  } catch (err) {
    console.log("getInventoryItemUserByUserName> error in findOne()");
    return res.status(500).json({ message: err.message });
  }
  res.inventoryItemUser = inventoryItemUser;
  next();
};

module.exports = getInventoryItemUserByUserName;
