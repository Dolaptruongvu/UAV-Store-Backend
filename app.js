// app.js
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpecs = require("./swagger");

const productRoutes = require("./Routes/productRoutes");
const customerRoutes = require("./Routes/customerRoutes");
const reviewRoutes = require("./Routes/reviewRoutes");
const billRoutes = require("./Routes/billRoutes");
const globalErrorHandler = require("./Controller/errorController");

const app = express();
app.enable("trust proxy");

// Middleware cho body parser và cookie parser
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Middleware cho morgan để log
app.use(morgan("common"));

// CORS để cho phép các yêu cầu từ frontend
app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5000",
      "http://localhost:3000",
      "http://localhost:5000",
      "https://uav-store-front-end-3nae-nn5s4pl9e-dolaptruongvus-projects.vercel.app",
      "https://uav-store-front-end-6jk6.vercel.app",
    ],
    credentials: true,
  })
);

// Tích hợp Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Middleware để xử lý file tĩnh
app.use(express.static(path.join(__dirname, "public")));

// Chú thích Swagger cho các route chính

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Lấy danh sách sản phẩm
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách sản phẩm
 *       500:
 *         description: Lỗi server
 */
app.use("/api/v1/products", productRoutes);

/**
 * @swagger
 * /api/v1/bill:
 *   get:
 *     summary: Lấy danh sách hóa đơn
 *     tags:
 *       - Bills
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách hóa đơn
 *       500:
 *         description: Lỗi server
 */
app.use("/api/v1/bill", billRoutes);

/**
 * @swagger
 * /api/v1/customer:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags:
 *       - Customers
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách khách hàng
 *       500:
 *         description: Lỗi server
 */
app.use("/api/v1/customer", customerRoutes);

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Lấy danh sách đánh giá
 *     tags:
 *       - Reviews
 *     responses:
 *       200:
 *         description: Thành công, trả về danh sách đánh giá
 *       500:
 *         description: Lỗi server
 */
app.use("/api/v1/reviews", reviewRoutes);

// Route test
app.use("/test", (req, res) => {
  res.json({ statement: "hello bro" });
});

// Middleware xử lý lỗi toàn cục
app.use(globalErrorHandler);

module.exports = { app };
