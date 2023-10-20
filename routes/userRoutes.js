const express = require('express');
const {
  register,
  login,
  getUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(protect, getUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);

module.exports = router;
