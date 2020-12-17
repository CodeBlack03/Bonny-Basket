const express = require("express");
const colors = require("colors");
const catchAsync = require("../utils/catchAsync");
const { Product, Review } = require("../models/Product");
const AppError = require("../utils/AppError");
const factory = require("../Controllers/factory");
exports.getProducts = catchAsync(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No Product Found!", 404));
  }
  res.status(200).json(product);
});

exports.createProductReview = catchAsync(async (req, res, next) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return next(new AppError("Product already reviewed", 400));
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    return next(new AppError("Product not found", 404));
  }
});

exports.getTopProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});

exports.deleteProduct = factory.deleteOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
