const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

advancedResults = (Model, populate) =>
  catchAsync(async (req, res, next) => {
    const excludeQuery = ["select", "sort", "page", "limit"];

    let reqQuery = { ...req.query };
    excludeQuery.forEach((q) => {
      delete reqQuery[q];
    });
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    queryStr = JSON.parse(queryStr);
    // console.log(queryStr);
    const keyword = queryStr.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    let query = Model.find({ ...keyword });

    const pagination = {};
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    const totalDocuments = await Model.countDocuments({ ...keyword });
    const firstPage = (page - 1) * limit;
    const lastPage = page * limit;

    if (firstPage > 0) {
      pagination.pre = {
        page: page - 1,
        limit,
      };
    }
    if (lastPage < totalDocuments) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    query.skip((page - 1) * limit).limit(limit);
    query.select(req.query.select);
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query.sort(sortBy);
    } else {
      query.sort("-createdAt");
    }
    if (populate) {
      query = query.populate(populate);
    }

    const result = await query;

    result.map((r) => {
      if (r.password) {
        r.password = undefined;
      }
    });

    // console.log(result);
    res.advancedResults = {
      success: true,
      count: result.length,
      pagination: {
        page,
        pages: Math.ceil(totalDocuments / limit),
      },
      data: result,
    };
    next();
  });
module.exports = advancedResults;
