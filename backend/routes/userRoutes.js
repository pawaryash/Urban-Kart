const express = require("express");
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, getUserDetails, updateUserPassword, updateUserProfile } = require("../controllers/userController");
const { authorizedRoles,isAuthenticatedUser } = require("../middlewares/auth");
const router =  express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").post(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser,getUserDetails);

router.route("/password/update").put(isAuthenticatedUser,updateUserPassword);

router.route("/profile/update").put(isAuthenticatedUser,updateUserProfile);

module.exports = router;