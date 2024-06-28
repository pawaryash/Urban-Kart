const express = require("express");
const app = express();

const errorMiddleware = require("./middlewares/error")

//this is the same as body-parser
app.use(express.json());

//Route Imports
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");

app.use("/api/v1/", product);
app.use("/api/v1/users", user);

//Middleware for error handling
app.use(errorMiddleware);

//this exported app module will be used in the main server.js module
module.exports = app;