//this middleware uses the custom defined class in "../utils/errorHandler" 
//this error middleware is used to handle errors

const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {

    if (!err) {
        err = new ErrorHandler('An unknown error occurred', 500);
    }
    
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //Invalid Mongo DB id error handling
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message, 500);
    }

    //Mongoose Duplicate Key Error
    if(err.code === 11000){
        const message = `User with this ${Object.keys(err.keyValue)} already exists!`
        err = new ErrorHandler(message, 400);
    }
    
    //Wrong JWT Error
    if(err.code ===  "JsonWebTokenError"){
        const message = `JSON Web Token is invalid, try again`;
        err = new ErrorHandler(message, 400);
    }

    //JWT Token Expired Error
    if(err.name === "TokenExpiredError"){
        const message = `JSON Web Token expired, try again`;
        err = new ErrorHandler(message, 400);
    }


    res.status(err.statusCode).json({
        success: false,
        error: err.statusCode,
        message: err.message,
        //trace the error stack
        trace: err.stack
    });
}