const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  admin: { type: String, required: true },
  groupname: { type: String, required: true },
  members: [
    {
      type: String,
      ref: "User",
    },
  ],
});

const GroupData = mongoose.model("GroupData", groupSchema);

module.exports = GroupData;
