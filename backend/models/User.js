const mongoose = require("mongoose"); // Erase if already required
const bcrypt = require("bcrypt");
const validator = require("validator");
const crypto = require("crypto");
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
    image: {
      type: String,
    },
    mobile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },

    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    passwordResetToken: String,
    passwordResetExpire: Date,
  },
  { timestamps: true }
);
userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email });

  if (!user) {
    throw new Error("Invalid email or Password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid email or Password");
  }
  return user;
};

userSchema.methods.getPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  const user = this;
  user.passwordResetToken = crypto
    .randomBytes(20)
    .update(resetToken)
    .digest("hex");
  user.passwordResetExpire = Date.now() * 10 * 30 * 30 * 1000;
  await user.save();
  return resetToken;
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
