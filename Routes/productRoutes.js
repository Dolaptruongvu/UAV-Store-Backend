// productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../Controller/productController");
const reviewRouter = require("./reviewRoutes");
const billRouter = require("./billRoutes");
const { protect, restrictTo } = require("../Controller/authController");

// review Route
router.use("/:productId/reviews", reviewRouter);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get the list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *                 example: "dji-mini-4-pro"
 *               name:
 *                 type: string
 *                 example: "Dji Mini 4 Pro"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dji-mini-4-pro.jpg"]
 *               manufacturer:
 *                 type: string
 *                 example: "DJI"
 *               category:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Drone", "Photography", "Compact"]
 *               weight:
 *                 type: number
 *                 example: 249.0
 *               dimensions:
 *                 type: string
 *                 example: "14 x 8 x 6 cm"
 *               batteryLife:
 *                 type: string
 *                 example: "34 minutes"
 *               range:
 *                 type: number
 *                 example: 10.0
 *               maxSpeed:
 *                 type: number
 *                 example: 57.6
 *               sensorType:
 *                 type: string
 *                 example: "4K Camera with 3-axis gimbal"
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-04-01"
 *               supplier:
 *                 type: string
 *                 example: "DJI Authorized Supplier"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               description:
 *                 type: string
 *                 example: "The DJI Mini 4 Pro is a compact, lightweight drone ideal for high-quality aerial shots."
 *               ratings:
 *                 type: number
 *                 example: 4.7
 *               price:
 *                 type: number
 *                 example: 450.00
 *               accessoriesIncluded:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Remote Control", "Battery", "Charging Cable", "Propeller Guards", "Carrying Case"]
 *               compatibility:
 *                 type: string
 *                 example: "Compatible with DJI Mini series accessories"
 *               type:
 *                 type: object
 *                 properties:
 *                   variant:
 *                     type: string
 *                     example: "Fly More Combo"
 *                   extraPrice:
 *                     type: number
 *                     example: 150.00
 *                   description:
 *                     type: string
 *                     example: "Includes additional batteries, a carrying bag, and extra propellers for extended flights."
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Server error
 */
router
  .route("/")
  .get(productController.allProduct)
  .post(productController.createProduct);

// Filter products by category
/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filter products by category
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Product category to filter by
 *     responses:
 *       200:
 *         description: Filtered list of products
 *       400:
 *         description: Invalid parameter
 *       500:
 *         description: Server error
 */
router.get("/filter", productController.filterProductsByCategory);

// Top 3 products
/**
 * @swagger
 * /products/top3Products:
 *   get:
 *     summary: Get the top 3 products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Top 3 products list
 *       500:
 *         description: Server error
 */
router.route("/top3Products").get(productController.top3Products);

// Protect routes for admin actions
router.use(protect);
router.use(restrictTo("admin"));

// Get one product, Update product, Delete product
/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get detailed information of a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Detailed information of the product
 *       404:
 *         description: Product not found
 *   patch:
 *     summary: Update product information
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dji Mavic 4 Pro"
 *               price:
 *                 type: number
 *                 example: 2200
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */
router
  .route("/:id")
  .get(productController.oneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
