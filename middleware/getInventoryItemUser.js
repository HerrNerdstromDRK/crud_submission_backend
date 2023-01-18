const InventoryItemUser = require("../models/InventoryItemUserModel");

/**
 * Middleware to find an inventory item user.
 * Add the user as res.inventoryItemUser.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const getInventoryItemUser = async (req, res, next) => {
  let inventoryItemUser;
  try {
    inventoryItemUser = await InventoryItemUser.findById(req.params.id);
    if (inventoryItemUser == null) {
      return res
        .status(404)
        .json({ message: "Cannot find inventory item user" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.inventoryItemUser = inventoryItemUser;
  next();
};

module.exports = getInventoryItemUser;
