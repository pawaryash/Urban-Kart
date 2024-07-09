const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middlewares/error");

//this is the same as body-parser
app.use(express.json());
express.urlencoded({ extended: true })

app.use(cookieParser());

//Route Imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");
const order = require("./routes/orderRoutes");

app.use("/api/v1/", product);
app.use("/api/v1/users", user);
app.use("/api/v1", user);
app.use("/api/v1/",order);

//Middleware for error handling
app.use(errorMiddleware);

//this exported app module will be used in the main server.js module
module.exports = app;