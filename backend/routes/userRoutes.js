const express = require("express");
const authController = require("../Controllers/authController.js");
const router = express.Router();
const advancedResults = require("../Middleware/getAdvancedResults");
const User = require("../models/User");
router.route("/login").post(authController.login);
router.route("/register").post(authController.signUp);
router
  .route("/profile")
  .get(authController.protect, authController.getProfile)
  .patch(authController.protect, authController.updateProfile);

router
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo(),
    advancedResults(User),
    authController.getUsers
  )
  .post(
    authController.protect,
    authController.restrictTo(),
    authController.createUser
  );

router
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo(),
    advancedResults(User),
    authController.getUser
  )
  .patch(
    authController.protect,
    authController.restrictTo(),
    authController.updateUser
  )
  .delete(
    authController.protect,
    authController.restrictTo(),
    authController.deleteUser
  );

module.exports = router;
