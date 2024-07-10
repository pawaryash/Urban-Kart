const express = require("express");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const { newOrder, getSingleOrder, getMyOrders, getAllOrders, updateOrderStatus, deleteOrder } = require("../controllers/orderController");
const router = express.Router();

//Place a new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

//Get a single order by id 
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

//Get my orders
router.route("/myorders/:id").get(isAuthenticatedUser, getMyOrders);

//Get all orders -- ADMIN
router.route("/allorders").get(isAuthenticatedUser, authorizedRoles("admin"), getAllOrders);

//Update an order status --ADMIN
router.route("/update/:orderId").put(isAuthenticatedUser, authorizedRoles("admin"), updateOrderStatus);

//Delete an Order --ADMIN
router.route("/delete/:orderId").delete(isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = router;