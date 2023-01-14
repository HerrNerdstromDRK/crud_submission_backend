const mongoose = require("mongoose");

const blogPostSchema = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  modifieddate: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("BlogPost", blogPostSchema);
