const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema({
  owner: {
    type: String,
    required: true,
  },
  itemname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  modifieddate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
