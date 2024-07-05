const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto")

//Register a User
exports.registerUser = catchAsyncError( async(req, res, next) => {
    const {name, email, password} = req.body

    const user = await User.create({
        name, email, password,
        avatar:{
            public_id: "this is a sample id",
            url: "profilePicUrl"
        }
    });

    sendToken(user,201,res);
});

//Login user
exports.loginUser = catchAsyncError(async (req, res, next)=>{
    const{email, password} = req.body;

    //check if both user and pwd are submitted by the user
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Email & Password", 400));
    }

    const user = await User.findOne({email: email}).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    //if password matches
    sendToken(user,201,res);
});

//Logout User
exports.logoutUser = catchAsyncError(async (req, res, next)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });

});

//Forgot Password 
exports.forgotPassword = catchAsyncError(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next( new ErrorHandler("User not found", 404));
    }
    
    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/users/password/reset/${resetToken}`;

    const message = `Your password reset token is: \n\n ${resetPasswordUrl} \n\n If not requested by you then please ignore this message.`;

    try{
        await sendEmail({
            email: user.email,
            subject: `Urban Kart Password Recovery`,
            message,
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        });

    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));

    }
});

//Password Reset
exports.resetPassword = catchAsyncError(async (req, res, next)=>{

    //creating token hash to be compared in database
   const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

   //compare token from reset link with the reset token 
   //generated and saved in database when clicking on forgot password
   const user = await User.findOne({
        resetPasswordToken: resetPasswordToken,
        resetPasswordExpire: {$gt: Date.now()}
    });

    if(!user){
        return next( new ErrorHandler("Reset Password token  is invalid or has been expired", 400));
    }

    //check if confirmed password is same as entered one
    if(req.body.password !== req.body.confirmPassword){
        return next( new ErrorHandler("Password does not match.", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user,200, res)

});

//Get User Details
exports.getUserDetails = catchAsyncError(async(req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    });
});

//Update User Password
exports.updateUserPassword = catchAsyncError(async(req, res, next)=>{
    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Old password is incorrect!",400));
    }

    if(req.body.newPassword !== req.body.confirmPassword){
        return next(new ErrorHandler("Password does not match!"), 400);
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user, 200, res);
});

//Update User Profile
exports.updateUserProfile = catchAsyncError(async(req, res, next)=>{
    const updatedUserData = {
        name: req.body.name,
        email: req.body.email,
    }
    //Cloudinary will be added later

    const user = await User.findByIdAndUpdate(req.user.id, updatedUserData,{
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
    });
});

//Get All Users on Admin Dashboard
exports.getAllUsers = catchAsyncError(async (req, res, next)=>{
    const users = await User.find();

    res.status(200).json({
        success: true,
        users,
    });
});

//Get Single User Detail on Admin Dashboard
exports.getSingleUser = catchAsyncError(async (req, res, next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User does not exist with ID: ${req.params.id}`));
    }

    res.status(200).json({
        success: true,
        user,
    });
});

