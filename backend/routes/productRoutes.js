const express = require("express");

const router = express.Router();
const productController = require("../Controllers/productController.js");
const authController = require("../Controllers/authController");
// @desc Fetch all products
// @route GET /api/products
// @access Public
router
  .route("/")
  .get(productController.getProducts)
  .post(
    authController.protect,
    authController.restrictTo(),
    productController.createProduct
  );

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
router
  .route("/:id")
  .get(productController.getProductById)
  .delete(
    authController.protect,
    authController.restrictTo(),
    productController.deleteProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo(),
    productController.updateProduct
  );

module.exports = router;
