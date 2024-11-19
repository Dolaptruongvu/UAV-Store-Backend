const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Product = require("../Model/productModel");
const multer = require("multer");
const { Op } = require("sequelize");
const { query } = require("express");
const path = require("path");


//create product
exports.createProduct = handlerFactory.createOne(Product);

// Read products
// exports.allProduct = handlerFactory.getAll(Product);
exports.oneProduct = handlerFactory.getOne(Product);

// Update product
exports.updateProduct = handlerFactory.updateOne(Product);

// Delete product
exports.deleteProduct = handlerFactory.deleteOne(Product);

// Read product by filter
exports.filterProductsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.query; // Get the category from query string

  let where = {};
  if (category) {
    const categories = category.split(","); // Split the category string into an array of categories
    where.category = categories; // Sequelize will automatically handle this as an IN clause
  }

  const products = await Product.findAll({ where }); // Find products matching the query

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.setProductUserIds = (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;

  // if (!req.body.customer) req.body.customer = req.customer.id;
  next();
};

exports.top3Products = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      isProminent: true, // Chỉ lấy các sản phẩm nổi bật
    },
    order: [["releaseDate", "DESC"]], // Sắp xếp theo ngày phát hành mới nhất
    limit: 3, // Giới hạn số lượng sản phẩm trả về là 3
  });
  res.status(200).json({
    status: "success",
    data: products,
  });
});

exports.allProduct = catchAsync(async (req, res, next) => {
  const { slugName } = req.query;
  if (slugName) {
    const products = await Product.findAll({
      where: {
        slug: {
          [Op.iLike]: `${slugName}%`,
        },
      },
    });

    res.status(200).json({
      status: "success",
      products,
    });
  } else {
    const products = await Product.findAll({});
    res.status(200).json({
      status: "success",
      products,
    });
  }
});
