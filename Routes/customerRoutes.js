// customerRoutes.js
const express = require("express");
const authController = require("../Controller/authController");
const customerController = require("../Controller/customerController");

const router = express.Router();

// For Authentication

/**
 * @swagger
 * /customer/me:
 *   get:
 *     summary: Lấy thông tin người dùng đã đăng nhập
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Thông tin của người dùng đã đăng nhập
 *       401:
 *         description: Không có quyền truy cập
 */
router
  .route("/me")
  .get(authController.isLoggedIn, customerController.getMeForAuthentication);

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       401:
 *         description: Thông tin đăng nhập không hợp lệ
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /customer/logout:
 *   get:
 *     summary: Đăng xuất người dùng
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 */
router.get("/logout", authController.logout);

/**
 * @swagger
 * /customer/signup:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               name:
 *                 type: string
 *                 example: "New User"
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post("/signup", authController.preventSetRight, authController.signup);

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Lấy danh sách khách hàng
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Danh sách khách hàng
 *   post:
 *     summary: Tạo khách hàng mới
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "customer@example.com"
 *               name:
 *                 type: string
 *                 example: "Customer Name"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: Khách hàng đã được tạo thành công
 */
router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một khách hàng
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của khách hàng
 *       404:
 *         description: Không tìm thấy khách hàng
 *   delete:
 *     summary: Xóa một khách hàng
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng
 *     responses:
 *       204:
 *         description: Khách hàng đã bị xóa
 *       404:
 *         description: Không tìm thấy khách hàng
 *   patch:
 *     summary: Cập nhật thông tin của một khách hàng
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của khách hàng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "updated@example.com"
 *               name:
 *                 type: string
 *                 example: "Updated Name"
 *     responses:
 *       200:
 *         description: Khách hàng đã được cập nhật
 *       404:
 *         description: Không tìm thấy khách hàng
 */
router
  .route("/:id")
  .get(customerController.getCustomer)
  .delete(customerController.deleteCustomer)
  .patch(customerController.updatedCustomer);

/**
 * @swagger
 * /customer/setRoles:
 *   put:
 *     summary: Thiết lập vai trò người dùng (admin)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Vai trò người dùng đã được cập nhật
 *       403:
 *         description: Không có quyền truy cập
 */
router
  .route("/setRoles")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    customerController.setRoles
  );

module.exports = router;
