const express = require("express");
const authController = require("../Controllers/authController.js");
const router = express.Router();

router.route("/login").post(authController.login);
router.route("/register").post(authController.signUp);
router
  .route("/profile")
  .get(authController.protect, authController.getProfile)
  .patch(authController.protect, authController.updateProfile);
module.exports = router;
