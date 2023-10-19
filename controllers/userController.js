const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const generateToken = require("../config/generateToken");

const register = asyncHandler(async (req, res) => {
  const { name, username, email, password, mobile_number, image, points } =
    req.body;

  if (!name || !username || !password || !mobile_number || !image) {
    errorResponse({ res, message: "Please fill required fields!" });
  }
  const emailExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ username });
  const mobileExists = await User.findOne({ mobile_number });

  if (emailExists) {
    errorResponse({ res, message: "Email already exists!" });
  }
  if (usernameExists) {
    errorResponse({ res, message: "Username already exists!" });
  }
  if(mobileExists) {
    errorResponse({ res, message: "Mobile number already exists!" });
  }

  const user = await User.create({
    name,
    username,
    email,
    password,
    mobile_number,
    image,
    points,
  });

  if (user) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobile_number,
      username: user.username,
      image: user.image,
      points: user.points,
      token: generateToken(user._id),
    };
    successResponse({
      res,
      message: "User created successfully",
      data: data,
    });
  } else {
    errorResponse({ res, message: "Something went wrong!" });
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const data = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile_number: user.mobile_number,
      username: user.username,
      image: user.image,
      points: user.points,
      token: generateToken(user._id),
    };
    successResponse({
      res,
      message: "User logged in successfully",
      data: data,
    });
  } else {
    errorResponse({ res, message: "User not found!" });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const users = await User.findOne({ _id: req.user._id }).select("-password");
  res.status(200).send(users);
});

module.exports = { register, login, getUser };
