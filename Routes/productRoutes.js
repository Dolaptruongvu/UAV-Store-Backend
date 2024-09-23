const express = require("express");
const router = express.Router();
const productController = require("../Controller/productController");
const reviewRouter = require("./reviewRoutes");
const billRouter = require("./billRoutes");
const {
  protect,
  isLoggedIn,
  restrictTo,
} = require("../Controller/authController");

// review Route
router.use("/:productId/reviews", reviewRouter);

// bill Route
router.use("/:productId/bill", billRouter);

// Create product routes

router
  .route("/")
  .get(productController.allProduct) // loss protect
  .post(productController.createProductTest); // loss productController.uploadImage, createProduct

// Filter products by category
router.get("/filter", productController.filterProductsByCategory);

// Top 3 products

router.route("/top3Products").get(productController.top3Products);

// Get one product, Update product, Delete product
router.use(protect);
router.use(restrictTo("admin"));
router
  .route("/:id")
  .get(productController.oneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
