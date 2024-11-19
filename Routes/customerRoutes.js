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
 *     summary: Get information of the logged-in user
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Information of the logged-in user
 *       401:
 *         description: Unauthorized access
 */
router
  .route("/me")
  .get(authController.isLoggedIn, customerController.getMeForAuthentication);

/**
 * @swagger
 * /customer/login:
 *   post:
 *     summary: User login
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
 *         description: Successful login
 *       401:
 *         description: Invalid login credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /customer/logout:
 *   get:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.get("/logout", authController.logout);

/**
 * @swagger
 * /customer/signup:
 *   post:
 *     summary: Register a new user
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
 *         description: Successful registration
 *       400:
 *         description: Invalid data
 */
router.post("/signup", authController.preventSetRight, authController.signup);

/**
 * @swagger
 * /customer:
 *   get:
 *     summary: Get the list of customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: List of customers
 *   post:
 *     summary: Create a new customer
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
 *         description: Customer created successfully
 */
router
  .route("/")
  .get(customerController.getAllCustomers)
  .post(customerController.createCustomer);

/**
 * @swagger
 * /customer/{id}:
 *   get:
 *     summary: Get detailed information of a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Detailed information of the customer
 *       404:
 *         description: Customer not found
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
 *     responses:
 *       204:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 *   patch:
 *     summary: Update information of a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Customer ID
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
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
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
 *     summary: Set user roles (admin)
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
 *         description: User role updated successfully
 *       403:
 *         description: Unauthorized access
 */
router
  .route("/setRoles")
  .put(
    authController.protect,
    authController.restrictTo("admin"),
    customerController.setRoles
  );

module.exports = router;
