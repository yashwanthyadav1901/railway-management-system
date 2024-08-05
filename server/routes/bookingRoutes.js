const express = require("express");
const router = express.Router();
const app = express();
const {
  addBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
} = require("./../controllers/bookingController");
const { verifyJWT } = require("../middleware/authMiddleware");

//protected routes
app.use(verifyJWT);
router.route("/booking-details").get(getBookingsByUser);

router.route("/").get(getAllBookings).post(addBooking);

router.route("/:id").get(getBooking).put(updateBooking).delete(deleteBooking);

module.exports = router;
