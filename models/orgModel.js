const mongoose = require("mongoose");

const orgModel = mongoose.Schema({
  admin_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  org_code: {
    type: String,
    required: true,
  },
  users: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  ],
});

module.exports = mongoose.model("Organizations", orgModel);
