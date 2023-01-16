const mongoose = require("mongoose");

const blogUserSchema = new mongoose.Schema({
  // _id is pre-defined by mongoDB
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
  },
});

module.exports = mongoose.model("BlogUser", blogUserSchema);
