const express = require("express");

const colors = require("colors");
const productRouter = require("./routes/productRoutes.js");
const userRouter = require("./routes/userRoutes.js");
const globalErrorhandler = require("./Controllers/errorController.js");
const AppError = require("./utils/AppError.js");
const app = express();
app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use(globalErrorhandler);
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;
