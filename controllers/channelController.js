const asyncHandler = require("express-async-handler");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const {
  create,
  join,
  fetchAll,
  rename,
  fetch,
  members,
} = require("../services/channelService");

const createChannel = asyncHandler(async (req, res) => {
  const { name, description, org_id } = req.body;
  if (!name || !description || !org_id) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await create(req, res);
  if (data) {
    successResponse({
      res,
      message: "Channel created successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong! Unable to create Channel",
    });
  }
});

const joinChannel = asyncHandler(async (req, res) => {
  const { channelId, org_id } = req.body;
  if (!channelId || !org_id) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await join(req, res);
  if (data == "exists") {
    errorResponse({
      res,
      message: "User has already joined!",
    });
  } else if (data) {
    successResponse({
      res,
      message: "Channel joined successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Channel Not found!",
    });
  }
});

const fetchAllChannels = asyncHandler(async (req, res) => {
  const { org } = req.query;
  if (!org) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await fetchAll(req, res);
  if (data) {
    successResponse({
      res,
      message: "Channels fetched successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong!",
    });
  }
});

const renameChannel = asyncHandler(async (req, res) => {
  const { channelId, name } = req.body;
  if (!channelId || !name) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await rename(req, res);
  if (data) {
    successResponse({
      res,
      message: "Renamed successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong!",
    });
  }
});

const fetchOneChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await fetch(req, res);
  if (data) {
    successResponse({
      res,
      message: "Channel fetched successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong!",
    });
  }
});

const getMembers = asyncHandler(async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const data = await members(req, res);
  if (data) {
    successResponse({
      res,
      message: "Channel fetched successfully",
      data: data,
    });
  } else {
    errorResponse({
      res,
      message: "Something went wrong!",
    });
  }
});

module.exports = {
  createChannel,
  joinChannel,
  fetchAllChannels,
  renameChannel,
  fetchOneChannel,
  getMembers
};
