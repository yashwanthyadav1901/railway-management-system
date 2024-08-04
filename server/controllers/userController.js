const { getDb } = require("../database/db");
const bcrypt = require("bcrypt");

// Get all users
const getAllUsers = async (req, res) => {
  const db = getDb();
  try {
    const [users] = await db.execute(
      "SELECT id, username, password, roles, active FROM users"
    );
    if (!users.length) {
      return res.status(400).json({ message: "No users found" });
    }
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create new user
const createNewUser = async (req, res) => {
  db = getDb();
  const { username, password, roles } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Checking for duplicate username
    const [rows] = await db.execute(
      "SELECT username FROM users WHERE username = ?",
      [username]
    );
    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hashing password
    const hashedPwd = await bcrypt.hash(password, 10); // 10 salt rounds

    await db.execute(
      "INSERT INTO users (username, password, roles) VALUES (?, ?, ?)",
      [username, hashedPwd, roles]
    );

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  const db = getDb();
  const { id, username, roles, active, password } = req.body;

  if (!id || !username || !roles) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  try {
    // Check if the user exists
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (!user.length) {
      return res.status(400).json({ message: "User not found" });
    }

    // Check for duplicate username
    const [duplicate] = await db.execute(
      "SELECT username FROM users WHERE username = ? AND id != ?",
      [username, id]
    );
    if (duplicate.length) {
      return res.status(409).json({ message: "Duplicate username" });
    }

    // Prepare update fields
    let updateFields = { username, roles, active };
    if (password) {
      updateFields.password = await bcrypt.hash(password, 10); // salt rounds
    }

    // Construct the update query dynamically
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updateFields)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);

    const updateQuery = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    // Execute the update query
    await db.execute(updateQuery, values);

    res.json({ message: `${username} updated` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const db = getDb();
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  try {
    // Does the user exist to delete?
    const [user] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
    if (!user.length) {
      return res.status(400).json({ message: "User not found" });
    }

    await db.execute("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: `Username ${user[0].username} with ID ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
