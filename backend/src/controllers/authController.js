const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;

    const exists = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (exists.rows.length)
      return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users(name,email,password,address,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role",
      [name, email, hashed, address, "user"]
    );

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (!result.rows.length)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
};
