const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
mongoose.plugin(slug);
const messageModel = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    receiver: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    content: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Text", "Media", "Document", "Link"],
    },
    attachments: {
      type: String,
    },
    chat: {
      type: mongoose.Schema.ObjectId,
      ref: "Chats",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Messages", messageModel);
