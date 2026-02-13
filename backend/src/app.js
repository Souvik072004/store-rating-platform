require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const storeRoutes = require("./routes/storeRoutes");
const ratingRoutes = require("./routes/ratingRoutes");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/stores", storeRoutes);
app.use("/api/rate", ratingRoutes);

app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT} 🚀`)
);
