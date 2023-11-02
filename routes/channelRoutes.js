const express = require('express');
const protect = require("../middlewares/authMiddleware");
const {
  createChannel,
  joinChannel,
  fetchAllChannels,
  renameChannel,
  fetchOneChannel,
  getMembers,
} = require("../controllers/channelController");

const router = express.Router();

router.route("/create-channel").post(protect, createChannel);
router.route("/join-channel").post(protect, joinChannel);
router.route("/fetch-all-channels").get(protect, fetchAllChannels);
router.route("/rename").put(protect, renameChannel);
router.route("/fetch-channel/:channelId").get(protect, fetchOneChannel);
router.route("/get-members").get(protect, getMembers);

module.exports = router;