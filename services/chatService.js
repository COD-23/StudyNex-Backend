const { successResponse, errorResponse } = require("../helpers/apiResponse");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const access = async (req, res) => {
  try {
    const { userList, chatName, org } = req.body;
    if (!userList || !chatName || !org) {
      return errorResponse({ res, message: "Please fill all fields!" });
    }

    const chatExist = await Chat.findOne({
      org: org,
      chatName: chatName,
    })
      .populate("users", "-password")
      .populate("latest_message");

    if (chatExist) {
      return successResponse({
        res,
        message: "Chat already exists",
        data: chatExist,
      });
      // return chatExist;
    }

    const chat = await Chat.create({
      chatName: chatName,
      users: userList,
      group_admin: req.user._id,
    });

    if (chat) {
      const data = await Chat.findOne({ chatName: chat.chatName });
      return data;
    }
  } catch (error) {
    console.log(error);
    errorResponse({ res, message: "Something went wrong!" });
  }
};

const fetchMsg = async (req, res) => {
  try {
    const { chatId } = req.params;

    const messages = await Message.find({
      chat: chatId,
    })
      .populate("sender", "name username ")
      .populate("receiver", "-password")
      .populate("chat");
    return messages;
  } catch (error) {
    console.log(error);
    return errorResponse({ res, message: "Something went wrong!" });
  }
};

const sendMsg = async (req, res) => {
  try {
    const { content, chat, type, receiver, mediaType, attachments } = req.body;

    const message = await Message.create({
      sender: req.user._id,
      type: type,
      receiver: receiver,
      content: content,
      chat: chat,
      mediaType: mediaType,
      attachments: attachments,
    });
    await message.populate("sender", "name");
    await message.populate("chat");
    await message.populate("receiver");
    // await User.populate(message,{
    //     path:"chat.users",
    //     select:"name email",
    // })

    //storing current msg as latest msg in chat collection.
    await Chat.findByIdAndUpdate(chat, { latest_message: message });
    return message;
  } catch (error) {
    console.log(error);
    return errorResponse({ res, message: "Something went wrong!" });
  }
};

const deleteMsg = async (req, res) => {
  try {
    const { messageId } = req.body;
    const deletedMessage = await Message.findOne({
      _id: messageId,
    });
    await Message.deleteOne({ _id: messageId });
    return deletedMessage;
  } catch (error) {
    console.log(error);
    return errorResponse({ res, message: "Something went wrong!" });
  }
};

module.exports = { access, fetch, fetchMsg, sendMsg, deleteMsg };
