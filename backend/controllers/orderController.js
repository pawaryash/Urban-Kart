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
    });
});

//Get all orders --ADMIN
exports.getAllOrders = catchAsyncError(async (req, res, next)=>{
    const allOrders = await Order.find();

    if(!allOrders){
        return next(new ErrorHandler("No orders found!"), 404);
    }

    let totalAmount = 0;
    allOrders.forEach((order) => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        allOrders,
    });
});

//Update order status --ADMIN
exports.updateOrderStatus = catchAsyncError(async (req, res, next)=>{
    const order = await Order.findById(req.params.orderId);

    if(!order){
        return next(new ErrorHandler("No orders found!"), 404);
    }
    else if(order.orderStatus === "delivered"){
        return next(new ErrorHandler("This order is already fulfilled!", 400));
    }

    await Promise.all(order.orderItems.map(async (item)=>{
        await updateStock(item.product._id, item.quantity);
    }));

    order.orderStatus = req.body.orderStatus;

    if(req.body.orderStatus === "delivered"){
        order.deliveredAt = Date.now();
    }

    await order.save();
    res.status(200).json({
        success: true,
        message: "Order is now fulfilled!"
    });  
});

async function updateStock(productId, quantity){
    const product = await Product.findById(productId);

    product.Stock -= quantity;

    await product.save();
}

//Delete Order
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);

    if(!order){
        return next(new ErrorHandler(`Order not found with ${req.params.orderId}`));
    }

    await order.deleteOne({_id: req.params.orderId});

    res.status(200).json({
        success: true,
    });
});