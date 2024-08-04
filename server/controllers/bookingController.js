const { getDb } = require("./../database/db"); // Adjust the path to your db module

const addBooking = async (req, res) => {
  const db = getDb();
  const { user_id, train_id, num_seats } = req.body;

  if (!user_id || !train_id || num_seats == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.beginTransaction(); // Start a transaction

    // Fetch available_seats and fare for the train
    const [trainRows] = await db.execute(
      "SELECT available_seats, fare FROM trains WHERE id = ?",
      [train_id]
    );

    if (trainRows.length === 0) {
      await db.rollback();
      return res.status(404).json({ message: "Train not found" });
    }

    const train = trainRows[0];
    if (num_seats > train.available_seats) {
      await db.rollback();
      return res.status(400).json({ message: "Not enough available seats" });
    }

    const total_fare = num_seats * train.fare;

    // Update available seats in trains table
    await db.execute(
      "UPDATE trains SET available_seats = available_seats - ? WHERE id = ?",
      [num_seats, train_id]
    );

    // Insert booking record
    await db.execute(
      "INSERT INTO bookings (user_id, train_id, num_seats, total_fare) VALUES (?, ?, ?, ?)",
      [user_id, train_id, num_seats, total_fare]
    );

    await db.commit(); // Commit the transaction

    res.status(201).json({ message: "Booking added successfully", total_fare });
  } catch (err) {
    await db.rollback(); // Rollback the transaction in case of error
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllBookings = async (req, res) => {
  const db = getDb();

  try {
    const [bookings] = await db.execute("SELECT * FROM bookings");
    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBooking = async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const [booking] = await db.execute("SELECT * FROM bookings WHERE id = ?", [
      id,
    ]);

    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateBooking = async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { user_id, train_id, num_seats, total_fare } = req.body;

  if (!user_id || !train_id || num_seats == null || total_fare == null) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE bookings SET user_id = ?, train_id = ?, num_seats = ?, total_fare = ? WHERE id = ?",
      [user_id, train_id, num_seats, total_fare, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteBooking = async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM bookings WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookingsByUser = async (req, res) => {
  const db = getDb();
  const { user_id } = req.params;

  try {
    const [bookings] = await db.execute(
      "SELECT * FROM bookings WHERE user_id = ?",
      [user_id]
    );

    if (bookings.length === 0) {
      return res
        .status(404)
        .json({ message: "No bookings found for this user" });
    }

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  addBooking,
  getAllBookings,
  getBooking,
  updateBooking,
  deleteBooking,
  getBookingsByUser,
};
