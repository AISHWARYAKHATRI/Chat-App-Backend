const express = require("express");
const {
  registerUser,
  authUser,
  verifyUser,
  allUsers,
} = require("../controller/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers);
router.post("/login", authUser);
router.get("/verify/:token", verifyUser);

module.exports = router;
