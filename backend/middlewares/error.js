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

    res.status(err.statusCode).json({
        success: false,
        error: err.statusCode,
        message: err.message,
        //trace the error stack
        trace: err.stack
    });
}