/**
 * Handle all routes that begin with /inventoryitems
 */
const express = require("express");
const router = express.Router();
const InventoryItem = require("../models/InventoryItemModel");

/**
 * Get all inventory items.
 */
router.get("/", async (req, res) => {
  console.log("get(/)> req.body: " + req.body);
  //  console.log(req);
  try {
    const inventoryItems = await InventoryItem.find();
    res.json(inventoryItems);
  } catch (err) {
    // 500 is server error code
    res.status(500).json({ message: err.message });
  }
});

/**
 * Retrieve all inventory items owned by the given username.
 */
router.get("/byusername/:userName", async (req, res) => {
  const userName = req.params.userName;
  console.log("get(/byusername/:userName)> userName: " + userName);
  try {
    const inventoryItems = await InventoryItem.find({ owner: userName });
    res.json(inventoryItems);
  } catch (err) {
    // 500 is server error code
    res.status(500).json({ message: err.message });
  }
});

/**
 * Retrieve a single inventory item.
 */
router.get("/:id", getInventoryItem, (req, res) => {
  console.log("get(/inventoryitems/:id)");
  res.send(res.inventoryItem);
});

/**
 * Create a new inventory item
 */
router.post("/", async (req, res) => {
  console.log("post(/)");
  const inventoryItem = new InventoryItem({
    owner: req.body.owner,
    itemname: req.body.itemname,
    description: req.body.description,
    quantity: req.body.quantity,
    datemodified: req.body.datemodified,
  });
  console.log("post(/)> inventoryItem: " + JSON.stringify(inventoryItem));
  try {
    const newInventoryItem = await inventoryItem.save();
    // 201: Successfully created object
    res.status(201).send(newInventoryItem);
  } catch (err) {
    // 400 bad data
    res.status(400).json({ message: err.message });
  }
});

/**
 * Update any fields of the inventory item that have changed.
 */
router.patch("/:id", getInventoryItem, async (req, res) => {
  console.log(
    "updatePost> original inventoryItem: " + JSON.stringify(res.inventoryItem)
  );
  if (req.body.author != null) {
    res.inventoryItem.author = req.body.author;
  }
  if (req.body.itemname != null) {
    res.inventoryItem.itemname = req.body.itemname;
  }
  if (req.body.quantity != null) {
    res.inventoryItem.quantity = req.body.quantity;
  }
  if (req.body.description != null) {
    res.inventoryItem.description = req.body.description;
  }
  if (req.body.modifieddate != null) {
    res.inventoryItem.modifieddate = req.body.modifieddate;
  }
  //  console.log(
  //    "updatePost> updated inventoryItem: " + JSON.stringify(res.inventoryItem)
  //  );

  try {
    const updatedInventoryItem = await res.inventoryItem.save();
    res.json(updatedInventoryItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * Delete a single inventory item by id.
 */
router.delete("/:id", getInventoryItem, async (req, res) => {
  console.log("delete> req.params.id: " + req.params.id);
  try {
    const userName = res.inventoryItem.author;
    await res.inventoryItem.delete();
    res.userName = userName;
    res.status(200).json({ message: "Deleted inventory item" });
  } catch (err) {
    console.err("delete> err: ");
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Retrieve an inventory item by id.
 * @param {} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
async function getInventoryItem(req, res, next) {
  console.log("getInventoryItem()");
  let inventoryItem;
  try {
    inventoryItem = await InventoryItem.findById(req.params.id).exec();
    if (null == inventoryItem) {
      return res.status(404).json({ message: "Cannot find inventory item" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.inventoryItem = inventoryItem;
  next();
}

module.exports = router;
