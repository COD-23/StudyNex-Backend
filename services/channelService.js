const { errorResponse } = require("../helpers/apiResponse");
const Channel = require("../models/channelModel");

const create = async (req, res) => {
  try {
    const { name, description, org_id } = req.body;

    const channel = await Channel.create({
      admin_id: req.user._id,
      name,
      description,
      org_id,
    });
    await channel.populate("admin_id", "-password");
    await channel.populate("org_id");

    if (channel) {
      const data = {
        _id: channel._id,
        admin_id: channel.admin_id,
        name: channel.name,
        description: channel.description,
        org_id: channel.org_id,
      };
      return data;
    }
    return null;
  } catch (error) {
    console.log(error);
  }
};

const join = async (req, res) => {
  try {
    const { channelId, org_id } = req.body;
    const channel = await Channel.findOne({ _id: channelId, org_id: org_id });
    if (!channel) {
      return null;
    }

    if (channel.users.includes(req.user._id)) {
      return "exists";
    }

    channel.users.push(req.user._id);
    await channel.save();
    await channel.populate("users", "-password");
    await channel.populate("admin_id", "-password");
    await channel.populate("org_id");

    return channel;
  } catch (error) {
    console.log(error);
  }
};

const fetchAll = async (req, res) => {
  try {
    const { org_id } = req.query;
    const allChannels = await Channel.find({
      org_id,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
    })
      .populate("admin_id", "-password")
      .populate("users", "-password")
      .sort({ updatedAt: -1 });
    return allChannels;
  } catch (error) {
    console.log(error);
  }
};

const rename = async (req, res) => {
  try {
    const { channelId, name } = req.body;
    const updatedChat = await Channel.findByIdAndUpdate(
      { _id: channelId },
      { name },
      { new: true }
    )
      .populate("users", "-password")
      .populate("admin_id", "-password");

    return updatedChat;
  } catch (error) {
    console.log(error);
  }
};

const fetch = async (req, res) => {
  try {
    const { channelId } = req.params;
    const channel = await Channel.find({
      _id: channelId,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
    })
      .populate("admin_id", "-password")
      .populate("users", "-password");
    return channel;
  } catch (error) {
    console.log(error);
  }
};

const members = async (req, res) => {
  try {
    const { channelId, search } = req.body;
    const channel = await Channel.findOne({ _id: channelId }).populate("users");

    if (!channel) {
      return null;
    }

    const matchingUsers = [];

    channel.users.forEach((user) => {
      if (
        (user.fname && user.name.match(new RegExp(search, "i"))) ||
        (user.email && user.email.match(new RegExp(search, "i")))
      ) {
        matchingUsers.push(user);
      }
    });
    return matchingUsers;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { create, join, fetchAll, rename, fetch, members };