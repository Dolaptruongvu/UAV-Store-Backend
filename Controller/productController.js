const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Product = require("../Model/productModel");
const multer = require("multer");
const { Op } = require("sequelize");
const { query } = require("express");

// Cover storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./Public/Img/Products"); // Change 'uploads' to your desired folder path
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}${
      file.originalname
    }`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage });

exports.uploadImage = upload.array("images", 1);

// Create product
exports.createProduct = catchAsync(async (req, res, next) => {
  let newProductData = {
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    category: req.body.category,
    language: req.body.language,
    translator: req.body.translator,
    totalPages: req.body.totalPages,
    releaseDate: req.body.releaseDate,
    supplier: req.body.supplier,
    coverType: req.body.coverType,
    weight: req.body.weight,
    quantity: req.body.quantity,
    description: req.body.description,
    ratings: req.body.ratings,
    price: req.body.price,
  };

  // Check if image file was uploaded before adding filename
  if (req.files.length > 0) {
    newProductData.images = [req.files[0].filename]; // Add filename to images array
  } else {
    newProductData.images = []; // Set images to an empty array if no file uploaded
  }

  const newProduct = await Product.create(newProductData);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});

// test create product

exports.createProductTest = handlerFactory.createOne(Product);

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
    order: [["releaseDate", "DESC"]],
    limit: 3,
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
