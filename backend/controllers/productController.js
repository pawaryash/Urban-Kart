const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");


//Create Product -- Admin Only
exports.createProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });

});

//Get All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {

    const resultsPerPage = 5;
    const productCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultsPerPage);
    
    const products = await apiFeature.query;
    res.status(200).json({
        success: true,
        products,
        productCount
    });
});

//update a product -- Admin
exports.updateProduct = catchAsyncError(async(req, res, next) => {

        //Query the Product model by using id param
        let product = await Product.findById(req.params.id);

        if(!product){
            return next(new ErrorHandler("Product not found", 404));
        }
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body,{
        new: true, 
        runValidators: true, 
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        product
    });

});

//delete a product --Admin
exports.deleteProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    
    await product.deleteOne({_id: req.params.id});

    res.status(200).json({
        success: true,
        message: `Product with id: ${req.params.id} deleted successfully.`
    });
    
});

//Get a single product details
exports.getProductDetails = catchAsyncError(async(req, res, next) =>{
    const product =  await Product.findById(req.params.id);

    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    res.status(200).json({

        success: true,
        product
    });
});