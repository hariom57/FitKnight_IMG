const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  pplink: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  prefer: { type: String, required: true },
  activity: { type: String, required: true },
  time: { type: String, required: true },
  requestlist: [
    {
      type: String,
      ref: "User",
    },
  ],
  pendingreq: [
    {
      type: String,
      ref: "User",
    },
  ],
  friends: [
    {
      type: String,
      ref: "User",
    },
  ],
});

const UserData = mongoose.model("UserData", userDataSchema);

module.exports = UserData;
