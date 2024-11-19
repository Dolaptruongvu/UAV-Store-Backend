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
 *     summary: Create a new review
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
 *                 example: "Great product!"
 *               productId:
 *                 type: string
 *                 example: "prod12345"
 *     responses:
 *       201:
 *         description: Review created successfully
 *       401:
 *         description: Unauthorized access
 *   get:
 *     summary: Get the list of all reviews
 *     tags: [Reviews]
 *     responses:
 *       200:
 *         description: List of reviews
 *       500:
 *         description: Server error
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
 *     summary: Get detailed information of a review
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Detailed information of the review
 *       404:
 *         description: Review not found
 *   delete:
 *     summary: Delete a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
 *     responses:
 *       204:
 *         description: Review deleted
 *       404:
 *         description: Review not found
 *   patch:
 *     summary: Update information of a review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Review ID
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
 *                 example: "Good review but some points need improvement."
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       400:
 *         description: Invalid data
 *       404:
 *         description: Review not found
 */
router
  .route("/:id")
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
