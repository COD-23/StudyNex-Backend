const express = require('express');
const { register, login, getUser } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user").get(protect, getUser);

module.exports = router;
