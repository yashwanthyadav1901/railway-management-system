const { getDb } = require("./../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  db = getDb();
  const { username, password } = req.body;
  console.log(req.body);

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const [rows] = await db.execute(
    "SELECT username FROM users WHERE username = ?",
    [username]
  );
  console.log([rows]);

  try {
    // Checking for duplicate username
    const [rows] = await db.execute(
      "SELECT username FROM users WHERE username = ?",
      [username]
    );
    console.log([rows]);
    if (rows.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Hashing password
    const hashedPwd = await bcrypt.hash(password, 10); // 10 salt rounds

    // Creating and storing the new user
    await db.execute(
      "INSERT INTO users (username, password, roles) VALUES (?, ?, ?)",
      [username, hashedPwd, "user"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const db = getDb();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    const foundUser = rows[0];

    if (!foundUser || !foundUser.active) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const match = await bcrypt.compare(password, foundUser.password);

    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      try {
        const db = getDb();
        const [rows] = await db.execute(
          "SELECT username, roles FROM users WHERE username = ?",
          [decoded.username]
        );
        const foundUser = rows[0];

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: foundUser.username,
              roles: foundUser.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );

        res.json({ accessToken });
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );
};

const logout = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204); // No content

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.json({ message: "Cookie cleared" });
};

const validateApiKey = async (req, res) => {
  const { apiKey } = req.body;

  if (apiKey === process.env.API_KEY) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  validateApiKey,
};
