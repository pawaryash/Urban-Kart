//Creating Tokens and saving in cookies

const sendToken = (user, statusCode, res)=>{
    const token = user.getJWTToken();

    //options for cookie
    const options = {
        expires:new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        //used to prevent client side scripts 
        //from accessing the cookie thus preventing
        //cross-site scripting (XSS) attacks
        httpOnly: true
    };

    res.status(statusCode).cookie("token",token, options).json({
            success: true,
            user,
            token,
    });
};

module.exports = sendToken;