const authController = require("./../controllers/authController");
const express = require("express");
const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").post(authController.login);
router.route("/refresh").get(authController.refresh);
router.route("/logout").post(authController.logout);
router.route("/validate-api-key").post(authController.validateApiKey);

module.exports = router;
