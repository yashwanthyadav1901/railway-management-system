const express = require("express");
const router = express.Router();
const {
  addBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
} = require("./../controllers/bookingController"); // Ensure this path is correct

// Add a new booking
router.route("/").get(getAllBookings).post(addBooking);

// Get a specific booking by ID, update it, or delete it
router.route("/:id").get(getBooking).put(updateBooking).delete(deleteBooking);

// Get bookings by user ID
router.route("/user/:user_id").get(getBookingsByUser);

module.exports = router;
