const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  username: { type: String, required: true },
  post: { type: String, required: true },
  time: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
