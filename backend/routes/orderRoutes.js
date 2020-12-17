const express = require("express");
const authController = require("../Controllers/authController.js");
const orderController = require("../Controllers/orderController");
const advancedResults = require("../Middleware/getAdvancedResults");
const Order = require("../models/Order");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, orderController.addOrders)
  .get(
    authController.protect,
    authController.restrictTo(),
    advancedResults(Order, { path: "user", select: "id name" }),

    orderController.getOrders
  );
router
  .route("/myorders")
  .get(authController.protect, orderController.getMyOrders);

router.route("/:id").get(authController.protect, orderController.getOrderById);
router
  .route("/:id/pay")
  .put(authController.protect, orderController.updateOrderToPaid);

router
  .route("/:id/deliver")
  .patch(
    authController.protect,
    authController.restrictTo(),
    orderController.updateOrderToDelivered
  );
module.exports = router;
