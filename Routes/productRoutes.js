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
 *     summary: Lấy danh sách tất cả sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách các sản phẩm
 *       500:
 *         description: Lỗi server
 *   post:
 *     summary: Tạo mới một sản phẩm
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
 *         description: Sản phẩm được tạo thành công
 *       500:
 *         description: Lỗi server
 */
router
  .route("/")
  .get(productController.allProduct)
  .post(
    productController.uploadImage, 
    productController.createProductTest
  );
// Filter products by category
/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Lọc sản phẩm theo danh mục
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         required: true
 *         description: Danh mục sản phẩm để lọc
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm sau khi lọc
 *       400:
 *         description: Tham số không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.get("/filter", productController.filterProductsByCategory);

// Top 3 products
/**
 * @swagger
 * /products/top3Products:
 *   get:
 *     summary: Lấy top 3 sản phẩm
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Danh sách top 3 sản phẩm
 *       500:
 *         description: Lỗi server
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
 *     summary: Lấy thông tin chi tiết của một sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của sản phẩm
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   patch:
 *     summary: Cập nhật thông tin của một sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
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
 *         description: Sản phẩm đã được cập nhật
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy sản phẩm
 *   delete:
 *     summary: Xóa một sản phẩm
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       204:
 *         description: Sản phẩm đã bị xóa
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router
  .route("/:id")
  .get(productController.oneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
