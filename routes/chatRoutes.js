const express = require("express");

const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { accessChat, fetchChat, fetchAllMessages, sendMessage } = require("../controllers/chatController");


router.route('/access-chat').post(protect,accessChat);
router.route('/fetch-chat').get(protect,fetchChat);
router.route('/fetch-message/:chatId').get(protect,fetchAllMessages);
router.route('/send-message').post(protect,sendMessage);

module.exports = router;
