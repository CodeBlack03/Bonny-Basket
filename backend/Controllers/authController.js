const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES,
  });
};

const createSendToken = (status, user, req, res) => {
  const token = signToken(user._id);
  const options = {
    expiresIn: Date.now() * 30 * 24 * 30 * 30 * 1000,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(status).cookie("token", token, options);
  user.password = undefined;

  res.status(status).json({
    token,
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("User already exists"));
  }
  user = await User.create(req.body);
  createSendToken(201, user, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findByCredentials(req.body.email, req.body.password);
  if (!user) {
    return next(new AppError("No user Found!", 404));
  }
  createSendToken(200, user, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.token) {
    token = req.cookie.token;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("User belonging to this token no longer exists", 401)
    );
  }
  req.user = user;
  req.token = token;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("Please enter a valid Email", 401));
  }
  const resetToken = user.getPasswordResetToken();
  const url = `${req.protocol}://${req.host}/users/resetPassword/${resetToken}`;
  const message = `Click on the link to reset your password \n\n ${url}`;

  await sendEmail({
    email: user.email,
    subject: "Password reset token",
    message,
  });
  res.status(200).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .randomBytes(20)
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
  });
  if (!user) {
    return next(new AppError("Invalid Reset Token!", 400));
  }
  if (user.passwordResetExpire < Date.now()) {
    return next(new AppError("Reset Password Token Expired!", 401));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password successfully expired",
  });
  createSendToken(200, user, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  let user = await User.findByCredentials(
    req.user.email,
    req.body.currentPassword
  );
  if (!user) {
    return next(new AppError("Current password is invalid!", 400));
  }
  // if (req.body.newPassword !== req.body.confirmNewPassword) {
  //   return next(new AppError("Password does not match", 400));
  // }
  user.password = req.body.newPassword;

  await user.save();
  createSendToken(200, user, req, res);
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "mobile"];
  const isValidOperation = updates.every((update) =>
    update !== "id" ? allowedUpdates.includes(update) : true
  ); //Update allowed or not
  if (!isValidOperation) {
    return res.status(400).send({
      error: "Invalid Updates!",
    });
  }

  updates.forEach((update) => {
    req.user[update] = req.body[update];
  });
  if (req.file) {
    req.user.image = req.file.filename;
  }
  await req.user.save();
  res.status(200).json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    isAdmin: req.user.isAdmin,
  });
});

exports.getProfile = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    return next(new AppError("User not found", 404));
  }
});
