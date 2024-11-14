// billRoutes.js
const express = require("express");
const billController = require("../Controller/billController");
const customerController = require("../Controller/customerController");
const authController = require("../Controller/authController");

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * /bill:
 *   post:
 *     summary: Tạo hóa đơn mới
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1000
 *               description:
 *                 type: string
 *                 example: "Payment for order #123"
 *     responses:
 *       201:
 *         description: Hóa đơn đã được tạo thành công
 *       401:
 *         description: Không có quyền truy cập
 *   get:
 *     summary: Lấy danh sách hóa đơn
 *     tags: [Bills]
 *     responses:
 *       200:
 *         description: Danh sách hóa đơn
 *       500:
 *         description: Lỗi server
 */
router
  .route("/")
  .post(
    authController.protect,
    customerController.setShipperId,
    billController.createBill
  )
  .get(billController.getBills);

/**
 * @swagger
 * /bill/myShippingBills:
 *   get:
 *     summary: Lấy danh sách hóa đơn giao hàng của shipper
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách hóa đơn giao hàng của shipper
 *       401:
 *         description: Không có quyền truy cập
 */
router
  .route("/myShippingBills")
  .get(
    authController.protect,
    authController.restrictTo("shipper", "admin"),
    billController.getShippingBill
  );

/**
 * @swagger
 * /bill/setPaymentStatus/{id}:
 *   patch:
 *     summary: Cập nhật trạng thái thanh toán của hóa đơn
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của hóa đơn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 example: "Paid"
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán đã được cập nhật
 *       404:
 *         description: Không tìm thấy hóa đơn
 */
router
  .route("/setPaymentStatus/:id")
  .patch(
    authController.protect,
    authController.restrictTo("shipper", "admin"),
    billController.setPaymentStatus
  );

/**
 * @swagger
 * /bill/checkout-session/{id}:
 *   get:
 *     summary: Tạo session thanh toán cho người dùng
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của hóa đơn
 *     responses:
 *       200:
 *         description: Session thanh toán đã được tạo
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy hóa đơn
 */
router.get(
  "/checkout-session/:id",
  authController.protect,
  authController.restrictTo("user"),
  billController.createCheckoutSession
);

/**
 * @swagger
 * /bill/update-pay/{billId}:
 *   post:
 *     summary: Cập nhật thanh toán cho hóa đơn
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: billId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của hóa đơn
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               paymentStatus:
 *                 type: string
 *                 example: "Completed"
 *     responses:
 *       200:
 *         description: Trạng thái thanh toán đã được cập nhật
 *       401:
 *         description: Không có quyền truy cập
 *       404:
 *         description: Không tìm thấy hóa đơn
 */
router.post(
  "/update-pay/:billId",
  authController.protect,
  authController.restrictTo("shipper"),
  billController.updatePay
);

module.exports = router;
