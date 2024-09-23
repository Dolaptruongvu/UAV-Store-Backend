const express = require("express");
const viewsController = require("../Controller/viewsController");
const authController = require("../Controller/authController");

const router = express.Router();

const listCategories = [
  "Action",
  "Fantasy",
  "Adventure",
  "History",
  "Animation",
  "Horror",
  "Thriller",
  "Mystery",
  "Comedy",
  "Romance",
  "Science Fiction",
  "Sci-fi",
];
const globalsVar = {
  listCategories,
};

router.use((req, res, next) => {
  res.locals = {
    ...res.locals,
    ...globalsVar,
  };
  next();
});

// Product detail
router.get(
  "/details/:productId",
  authController.isLoggedIn,
  viewsController.getProductDetail
);

// Cart Items
router.get("/cart", authController.isLoggedIn, viewsController.getCart);

// Contract & services
router.get("/contracts", viewsController.getContracts);

// Login page
router.get("/login", authController.isLoggedIn, viewsController.getLogin);

// Signup page
router.get("/signup", authController.isLoggedIn, viewsController.getSignup);

// Overview page
router.get("/", authController.isLoggedIn, viewsController.getOverview);

// Filtered products
router
  .route("/filter")
  .get(authController.isLoggedIn, viewsController.filteredProducts);

// Profile
router
  .route("/profile")
  .get(authController.isLoggedIn, viewsController.getProfile);

// Get shipping bills
router
  .route("/shippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper"),
    viewsController.getShipBills
  );

// Success page
router
  .route("/success/:billId")
  .get(
    authController.protect,
    viewsController.getSuccess
  );

module.exports = router;
