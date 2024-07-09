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

//Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) =>{
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if(!order){
        return next(new ErrorHandler(`Order not found with ID: ${req.params.id}`,404));
    }

    res.status(200).json({
        success: true,
        order,
    });
});

//Get logged in user's orders
exports.getMyOrders = catchAsyncError(async(req, res, next)=>{
    const myOrders = await Order.find({user: req.user._id});

    if (!myOrders){
        return next(new ErrorHandler(`No orders placed with user: ${req.user._id}`));
    }

    res.status(200).json({
        success: true,
        myOrders,
    })
})