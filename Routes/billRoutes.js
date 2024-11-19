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
 *     summary: Create a new bill
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
 *         description: Bill created successfully
 *       401:
 *         description: Unauthorized access
 *   get:
 *     summary: Get the list of bills
 *     tags: [Bills]
 *     responses:
 *       200:
 *         description: List of bills
 *       500:
 *         description: Server error
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
 *     summary: Get the list of shipping bills for the shipper
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of shipping bills for the shipper
 *       401:
 *         description: Unauthorized access
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
 *     summary: Update the payment status of the bill
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bill ID
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
 *         description: Payment status updated successfully
 *       404:
 *         description: Bill not found
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
 *     summary: Create a payment session for the user
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Bill ID
 *     responses:
 *       200:
 *         description: Payment session created
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Bill not found
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
 *     summary: Update payment for the bill
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: billId
 *         schema:
 *           type: string
 *         required: true
 *         description: Bill ID
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
 *         description: Payment status updated
 *       401:
 *         description: Unauthorized access
 *       404:
 *         description: Bill not found
 */
router.post(
  "/update-pay/:billId",
  authController.protect,
  authController.restrictTo("shipper"),
  billController.updatePay
);

module.exports = router;
