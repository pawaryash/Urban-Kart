const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");

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

//Forgot Password and reset
exports.forgotPassword = catchAsyncError(async(req, res, next)=>{
    const user = await User.findOne({email: req.body.email});

    if(!user){
        return next( new ErrorHandler("User not found", 404));
    }
    
    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({validateBeforeSave: false});

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;

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


