const AppError = require("../utils/appError");
const { catchAsync } = require("../utils/catchAsync");
const handlerFactory = require("./handlerFactory");
const Product = require("../Model/productModel");
const multer = require("multer");
const { Op } = require("sequelize");
const { query } = require("express");
const path = require("path");

// Cover storage
/*const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "carouselImage") {
      cb(null, "./Public/Img/CarouselImages");
    } else {
      cb(null, "./Public/Img/Products");
    }
  },
  filename: (req, file, cb) => {
    // Use slug as filename if provided, or fallback to a generated filename
    const slug = req.body.slug || `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${slug}${ext}`);
  },
});

const upload = multer({ storage });

exports.uploadImage = upload.fields([
  { name: "productImage", maxCount: 1 },
  { name: "carouselImage", maxCount: 1 },
]);

exports.createProduct = catchAsync(async (req, res, next) => {
  // Generate slug from product name
  const slug = req.body.name.trim().toLowerCase().replace(/ /g, "-");
  
  const newProductData = {
    slug, // Assign the generated slug
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    category: req.body.category,
    releaseDate: req.body.releaseDate,
    supplier: req.body.supplier,
    quantity: req.body.quantity,
    description: req.body.description,
    ratings: req.body.ratings,
    price: req.body.price,
    type: JSON.parse(req.body.type),
    isProminent: req.body.isProminent === "true",
  };

  // Assign image filenames based on slug
  if (req.files && req.files.productImage && req.files.productImage.length > 0) {
    newProductData.images = [`${slug}${path.extname(req.files.productImage[0].originalname)}`];
  } else {
    newProductData.images = [];
  }

  if (req.body.isProminent === "true" && req.files && req.files.carouselImage && req.files.carouselImage.length > 0) {
    newProductData.carouselImage = `${slug}${path.extname(req.files.carouselImage[0].originalname)}`;
  }

  const newProduct = await Product.create(newProductData);

  res.status(201).json({
    status: "success",
    data: {
      product: newProduct,
    },
  });
});
*/


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
