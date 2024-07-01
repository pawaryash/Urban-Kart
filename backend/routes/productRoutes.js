const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

//new product route
router.route("/product/new").post(isAuthenticatedUser,authorizedRoles("admin"), createProduct);

//update a product
router.route("/product/:id").put(updateProduct);

//delete a product
router.route("/product/:id").delete(deleteProduct);

//get a single product
router.route("/product/:id").get(getProductDetails);

module.exports = router;