const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview } = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);

//new product route
router.route("/admin/product/new").post(isAuthenticatedUser,authorizedRoles("admin"), createProduct);

//update a product
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizedRoles("admin"),updateProduct);

//delete a product
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizedRoles("admin"),deleteProduct);

//get a single product
router.route("/product/:id").get(getProductDetails);

router.route("/product/reviews").put(isAuthenticatedUser, createProductReview);

module.exports = router;