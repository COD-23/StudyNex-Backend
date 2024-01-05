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
    },
    mediaContent: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Text", "Image", "Document", "Video","Hybrid"],
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
