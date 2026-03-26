const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const generateToken = require("../utils/generateToken");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    if (process.env.DEMO_MODE === "true" || !pool.isDbAvailable?.()) {
      return res.status(503).json({ message: "Database not available. Please use Guest login." });
    }

    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user exists
    const userExists = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, hashedPassword, role || "user"]
    );

    const user = newUser.rows[0];

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });

  } catch (error) {
    console.error("SIGNUP ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    if (process.env.DEMO_MODE === "true" || !pool.isDbAvailable?.()) {
      return res.status(503).json({ message: "Database not available. Please use Guest login." });
    }

    const { email, password } = req.body;

    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role),
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Guest login is meant for demos when DB/auth user provisioning isn't available.
// It returns a signed JWT without performing any database operations.
exports.guestLogin = async (req, res) => {
  try {
    const guest = {
      id: "guest",
      name: "Guest",
      email: "guest@example.com",
      role: "user",
    };

    res.json({
      ...guest,
      token: generateToken(guest.id, guest.role),
    });
  } catch (error) {
    console.error("GUEST LOGIN ERROR:", error?.message || error);
    res.status(500).json({ message: "Server error" });
  }
};
