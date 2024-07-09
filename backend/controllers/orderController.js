const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

//Create a new order
exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {shippingInfo, orderItems, paymentInfo, itemsPrice, taxCharges, shippingCharges, totalPrice} = req.body;

    const order = await Order.create({
        shippingInfo, 
        orderItems, 
        paymentInfo, 
        itemsPrice, 
        taxCharges, 
        shippingCharges, 
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
    });

    res.status(201).json({
        success: true,
        order
    });

});