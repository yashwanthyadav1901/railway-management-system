const { getDb } = require("../database/db");

const addTrain = async (req, res) => {
  const db = getDb();
  const { name, source, destination, available_seats, fare } = req.body;

  if (
    !name ||
    !source ||
    !destination ||
    available_seats == null ||
    fare == null
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    await db.execute(
      "INSERT INTO trains (name, source, destination, available_seats, fare) VALUES (?, ?, ?, ?, ?)",
      [name, source, destination, available_seats, fare]
    );
    res.status(201).json({ message: "Train added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getSeatAvailability = async (req, res) => {
  const db = getDb();
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res
      .status(400)
      .json({ message: "Source and destination are required" });
  }

  try {
    const [trains] = await db.execute(
      "SELECT id, name, available_seats FROM trains WHERE source = ? AND destination = ?",
      [source, destination]
    );
    res.json(trains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllTrains = async (req, res) => {
  const db = getDb();

  try {
    const [trains] = await db.execute("SELECT * FROM trains");
    res.status(200).json(trains);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getTrain = async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const [train] = await db.execute("SELECT * FROM trains WHERE id = ?", [id]);

    if (train.length === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    res.status(200).json(train[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateTrain = async (req, res) => {
  const db = getDb();
  const { id } = req.params;
  const { name, source, destination, available_seats, fare } = req.body;

  if (
    !name ||
    !source ||
    !destination ||
    available_seats == null ||
    fare == null
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [result] = await db.execute(
      "UPDATE trains SET name = ?, source = ?, destination = ?, available_seats = ?, fare = ? WHERE id = ?",
      [name, source, destination, available_seats, fare, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    res.status(200).json({ message: "Train updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTrain = async (req, res) => {
  const db = getDb();
  const { id } = req.params;

  try {
    const [result] = await db.execute("DELETE FROM trains WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Train not found" });
    }

    res.status(200).json({ message: "Train deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllTrains,
  getTrain,

  addTrain,
  getSeatAvailability,
  updateTrain,
  deleteTrain,
};
