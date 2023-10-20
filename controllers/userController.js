const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { errorResponse, successResponse } = require("../helpers/apiResponse");
const generateToken = require("../config/generateToken");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
const bcrypt = require("bcryptjs");

const register = asyncHandler(async (req, res) => {
  try {
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
    if (mobileExists) {
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
  } catch (error) {
    errorResponse({ res, message: "Something went wrong!" });
  }
});

const login = asyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    errorResponse({ res, message: "Something went wrong!" });
  }
});

const getUser = asyncHandler(async (req, res) => {
  const users = await User.findOne({ _id: req.user._id }).select("-password");
  res.status(200).send(users);
});

const sendPasswordMail = (name, email, token) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "For Reset Password",
      html: `<p>Hi ${name}, Please copy the link <a href="http://localhost:3000/reset-password?token=${token}">and reset your password.</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Mail has been sent : ", info.response);
      }
    });
  } catch (error) {}
};

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      errorResponse({ res, message: "Email is required!" });
    }
    const user = await User.findOne({ email });
    if (user) {
      const token = randomstring.generate();
      await User.updateOne(
        { email: email },
        { $set: { token: token } },
        { new: true }
      );
      const user = await User.findOne({ email });
      sendPasswordMail(user.name, user.email, token);
      successResponse({
        res,
        message: "Please check your inbox and resend your password",
      });
    } else {
      errorResponse({ res, message: "User not found!" });
    }
  } catch (error) {
    errorResponse({ res, message: "Something went wrong!" });
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!password) {
      errorResponse({ res, message: "Password is required!" });
    }
    const tokenData = await User.findOne({ token });
    if (tokenData) {
       const salt = await bcrypt.genSalt(10);
       let newPass = await bcrypt.hash(password, salt);
      await User.findByIdAndUpdate(
        { _id: tokenData._id },
        { $set: { password: newPass, token: "" } },
        { new: true }
      );
      successResponse({
        res,
        message: "Password has been changed successfully!",
      });
    } else {
      errorResponse({ res, message: "Link has been expired!" });
    }
  } catch (error) {
    errorResponse({ res, message: "Something went wrong!" });
  }
});

module.exports = { register, login, getUser, forgotPassword, resetPassword };
