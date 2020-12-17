require("dotenv").config();
process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception! 🔥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
require("./db/mongoose");
const express = require("express");
const path = require("path");

const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on ${port} port!`.yellow
      .bold
  )
);
process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection! 🔥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
