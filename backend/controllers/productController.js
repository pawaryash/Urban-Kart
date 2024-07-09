const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");


//Create Product -- Admin Only
exports.createProduct = catchAsyncError(async(req, res, next) => {
    req.body.user = req.user.id
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

//Create new product review or Update review
exports.createProductReview = catchAsyncError(async (req, res, next)=>{
    
    const {rating, comment, productId} = req.body;

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating : Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    const isReviewed = product.reviews.find(
        (rev) => rev.user?.toString() === req.user._id?.toString()
    );

    // const reviewIndex  = product.reviews.findIndex((rev) => review.user?.toString() === req.user._id.toString());

    if(isReviewed){
        product.reviews.forEach(rev => {
            if(rev.user?.toString() === req.user._id?.toString()){
                rev.rating = rating,
                rev.comment = comment
            }
        });
    
    }
    else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    //Calculate overall ratings
    // const reviewsSum = 0;
    // product.overallRating = product.reviews.forEach((rev)=>{
    //     reviewsSum += rev.rating;
    // });

    product.overallRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0)/product.reviews.length;
    
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,  
    });
});

//Get all reviews of a product
exports.getAllProductReviews = catchAsyncError(async (req, res, next) => {
    const productId = req.params.id;
    console.log(productId);
    const product = await Product.findById(productId);

    console.log(product);

    if(!product){
        return next(new ErrorHandler(`Product not found with product ID: ${req.params.productId}`,400));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
});

//Delete a Review
exports.deleteReview = catchAsyncError(async (req, res, next) =>{
    const product = await Product.findById(req.query.id);
    
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = product.reviews.filter((review) => 
        review._id.toString() !== req.query.reviewId
    );

    product.reviews = reviews;
    await product.save();

    res.status(200).json({
        success: true,
        message: "Review deleted successfully",
    });
});
