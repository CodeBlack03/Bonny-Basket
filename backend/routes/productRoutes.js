const express = require("express");

const router = express.Router();
const advancedResults = require("../Middleware/getAdvancedResults");
const { Product } = require("../models/Product");
const productController = require("../Controllers/productController.js");
const authController = require("../Controllers/authController");
// @desc Fetch all products
// @route GET /api/products
// @access Public
router
  .route("/")
  .get(advancedResults(Product), productController.getProducts)
  .post(
    authController.protect,
    authController.restrictTo(),
    productController.createProduct
  );
router
  .route("/:id/reviews")
  .post(authController.protect, productController.createProductReview);

router.route("/top").get(productController.getTopProducts);

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
