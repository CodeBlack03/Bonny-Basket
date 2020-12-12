const express = require("express");

const router = express.Router();
const productController = require("../Controllers/productController.js");

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.route("/").get(productController.getProducts);

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
router.route("/:id").get(productController.getProductById);

module.exports = router;
