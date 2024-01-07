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
    attachments: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Text", "Media", "Hybrid"],
    },
    mediaType: {
      type: String,
      enum: ["Image", "Video", "Document","Unknown"],
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
