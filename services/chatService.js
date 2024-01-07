const { successResponse, errorResponse } = require("../helpers/apiResponse");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const access = async (req, res) => {
  try {
    const { userList, chatName } = req.body;
    // let users = JSON.parse(userList);
    // userList.push(JSON.parse(req.user._id));
    // console.log(userList);

    const chatExist = await Chat.findOne({
      // $and: [
      //   { users: { $elemMatch: { $eq: req.user._id } } },
      //   { users: { $elemMatch: { $eq: userId } } },
      // ],
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
const fetch = async (req, res) => {
  const { body } = req;
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
    errorResponse({ res, message: "Something went wrong!" });
  }
};

const sendMsg = async (req, res) => {
  try {
    const { content, chat, type, receiver, mediaType,attachments } = req.body;

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
    errorResponse({ res, message: "Something went wrong!" });
  }
};

module.exports = { access, fetch, fetchMsg, sendMsg };
