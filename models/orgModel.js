const mongoose = require("mongoose");

const orgModel = mongoose.Schema({
  admin_id: {
    type: String,
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
  users: [mongoose.Schema.ObjectId],
});

module.exports = mongoose.model("Organizations", orgModel);
