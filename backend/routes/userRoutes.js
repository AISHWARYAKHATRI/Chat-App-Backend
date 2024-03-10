const express = require("express");
const {
  registerUser,
  authUser,
  verifyUser,
} = require("../controller/userController");

const router = express.Router();

router.route("/").post(registerUser);
router.post("/login", authUser);
router.get("/verify/:token", verifyUser);

module.exports = router;
