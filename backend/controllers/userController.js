const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");

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

