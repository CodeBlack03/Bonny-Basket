const express = require("express");

const router = express.Router();
const productController = require("../Controllers/productController");

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.route("/api/products").get(productController.getProducts);

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
router.route("/api/products/:id").get(productController.getProductById);

module.exports = router;
