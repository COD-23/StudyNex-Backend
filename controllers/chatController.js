const asyncHandler = require("express-async-handler");
const { successResponse, errorResponse } = require("../helpers/apiResponse");
const { fetch, access, fetchMsg, sendMsg } = require("../services/chatService");

const accessChat = asyncHandler(async (req, res) => {
  const { chatName, userList } = req.body;
  if (!chatName || !userList) {
    return errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await access(req, res);

  if (data) {
    successResponse({
      res,
      message: "Chat created successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong! Unable to create chat",
    });
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  const data = await fetch(req, res);
  if (data) {
    successResponse({
      res,
      message: "Organization created successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong! Unable to create organization",
    });
  }
});

const fetchAllMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  if (!chatId) {
    return errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await fetchMsg(req, res);
  if (data) {
    successResponse({
      res,
      message: "Messages fetched successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong! Unable to fetch messages",
    });
  }
});

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chat } = req.body;
  if (!content || !chat) {
    return errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await sendMsg(req, res);
  if (data) {
    successResponse({
      res,
      message: "Message sent successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong! Unable to send message",
    });
  }
});

module.exports = { accessChat, fetchChat, fetchAllMessages, sendMessage };
