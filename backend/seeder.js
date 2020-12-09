require("dotenv").config();
require("./db/mongoose");
const mongoose = require("mongoose");
const colors = require("colors");
const Product = require("./models/Product");
const User = require("./models/User");
const users = require("./data/users");
const products = require("./data/products");
const catchAsync = require("./utils/catchAsync");

const importData = catchAsync(async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  const createdUser = await User.create(users);
  const adminUser = createdUser[0]._id;

  const sampleProducts = products.map((product) => {
    return { ...product, user: adminUser };
  });
  await Product.create(sampleProducts);
  console.log("Data Imported".green.inverse);
  process.exit();
});

const destroyData = catchAsync(async () => {
  await User.deleteMany();
  await Product.deleteMany();
  await User.deleteMany();
  console.log("Data Destroyed".red.inverse);
  process.exit();
});

if (process.argv[2] === "--d") {
  destroyData();
} else {
  importData();
}
