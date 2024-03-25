const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  accessIndividualChat,
  fetchAllChats,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatController");

router.route("/").post(protect, accessIndividualChat);
router.route("/").get(protect, fetchAllChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroupChat);
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);

module.exports = router;
