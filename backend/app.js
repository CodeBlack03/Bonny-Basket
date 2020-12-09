const express = require("express");

const colors = require("colors");
const productRouter = require("./routes/productRoutes.js");
const globalErrorhandler = require("./Controllers/errorController");

const app = express();
app.use(express.json());
app.use(productRouter);
app.use(globalErrorhandler);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
module.exports = app;
