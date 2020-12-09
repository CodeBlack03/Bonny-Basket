require("dotenv").config();
process.on("uncaughtException", (err) => {
  console.log("Unhandled Exception! 🔥 Shutting down...");
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});
require("./db/mongoose");
const app = require("./app");
const port = process.env.PORT;

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
