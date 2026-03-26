const jwt = require("jsonwebtoken");

const generateToken = (id, role = "user") => {
  // When deployed, JWT_SECRET might not be set yet for demo purposes.
  // Using a fallback keeps endpoints usable for development/demonstrations.
  const secret = process.env.JWT_SECRET || "dev-jwt-secret";
  return jwt.sign(
    { id, role },
    secret,
    { expiresIn: "7d" }
  );
};

module.exports = generateToken;
