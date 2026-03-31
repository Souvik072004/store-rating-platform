// app.js

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

const app = express();

// CORS Configuration
function parseOrigins(value) {
  return (value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeOrigin(value) {
  const v = (value || "").trim();
  return v.endsWith("/") ? v.slice(0, -1) : v;
}

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  // Known production frontends (keep the list small; prefer env for changes)
  "https://store-rating-platform-five.vercel.app",
  process.env.FRONTEND_URL,
  ...parseOrigins(process.env.FRONTEND_URLS),
]
  .filter(Boolean)
  .map(normalizeOrigin);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no Origin) and same-origin requests
    if (!origin) return callback(null, true);
    const normalized = normalizeOrigin(origin);
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Middlewares
app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan("dev"));

// Routes
const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const statsRoutes = require("./routes/statsRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api/stats", statsRoutes);

app.get("/", (req, res) => {
  res.send("Store Rating API is running 🚀");
});

module.exports = app;