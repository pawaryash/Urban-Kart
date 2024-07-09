const express = require("express");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const { newOrder, getSingleOrder, getMyOrders } = require("../controllers/orderController");
const router = express.Router();

//Place a new order
router.route("/order/new").post(isAuthenticatedUser, newOrder);

//Get a order by id - ADMIN only 
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);

//Get my orders
router.route("/order/myorders/:id").get(isAuthenticatedUser, getMyOrders);
module.exports = router;