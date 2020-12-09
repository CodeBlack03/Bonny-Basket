const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const validator = require("validator");
const colors = require("colors");

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is Invalid!".red.inverse);
        }
      },
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      required: true,
      validate(value) {
        if (this.password !== value) {
          throw new Error("Passwords does not match!".red.inverse);
        }
      },
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await Users.findOne({ email: email });

  if (!user) {
    throw new Error("No user found".red.inverse);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Unable to login".red.inverse);
  }
  return user;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }

  next();
});
//Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;
