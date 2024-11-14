// reviewRoutes.js
const express = require("express");
const reviewController = require("../Controller/reviewController");
const productController = require("../Controller/productController");
// const { protect, restrictTo } = require("../Controller/authController");

const router = express.Router({ mergeParams: true });

// router.use(protect);

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Tạo mới một đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Sản phẩm tuyệt vời!"
 *               productId:
 *                 type: string
 *                 example: "prod12345"
 *     responses:
 *       201:
 *         description: Đánh giá đã được tạo thành công
 *       401:
 *         description: Không có quyền truy cập
 *   get:
 *     summary: Lấy danh sách tất cả các đánh giá
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: Danh sách các đánh giá
 *       500:
 *         description: Lỗi server
 */
router
  .route("/")
  .post(
    // restrictTo("user"),
    productController.setProductUserIds,
    reviewController.createReview
  )
  .get(reviewController.getAllReviews);

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết của một đánh giá
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đánh giá
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của đánh giá
 *       404:
 *         description: Không tìm thấy đánh giá
 *   delete:
 *     summary: Xóa một đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đánh giá
 *     responses:
 *       204:
 *         description: Đánh giá đã bị xóa
 *       404:
 *         description: Không tìm thấy đánh giá
 *   patch:
 *     summary: Cập nhật thông tin của một đánh giá
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của đánh giá
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: "Đánh giá tốt nhưng còn một số điểm cần cải thiện."
 *     responses:
 *       200:
 *         description: Đánh giá đã được cập nhật
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Không tìm thấy đánh giá
 */
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
