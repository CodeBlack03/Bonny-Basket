const express = require("express");
const colors = require("colors");
const catchAsync = require("../utils/catchAsync");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const factory = require("../Controllers/factory");
exports.getProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find({});

  if (!products) {
    return next(new AppError("No Product Found!", 404));
  }
  res.status(200).json(products);
});

exports.getProductById = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No Product Found!", 404));
  }
  res.status(200).json(product);
});

exports.deleteProduct = factory.deleteOne(Product);
exports.createProduct = factory.createOne(Product);
exports.updateProduct = factory.updateOne(Product);
