const express = require("express");
const router = express.Router();
const app = express();
const userController = require("../controllers/userController");
const { verifyJWT } = require("../middleware/authMiddleware");

//protected routes
app.use(verifyJWT);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
