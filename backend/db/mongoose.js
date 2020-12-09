const mongoose = require("mongoose");
const colors = require("colors");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(
  "mongodb+srv://CodeBlack03:heropanti003@codeblack03.furnw.mongodb.net/Bonny-BasketDb?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      console.log("MongoDB Connection Succeeded.".yellow.bold);
    } else {
      console.log("Error in DB connection: " + err);
    }
  }
);
