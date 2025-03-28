const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const database = require("./database/connection");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoute");
const reviewRoutes = require("./routes/reviewsRoute");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

app.use(compression());

// rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  message: "Too many requests, please try again later",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));

// applied rate limiting to all product routes
app.use("/", apiLimiter, productRoutes);
app.use("/", apiLimiter, cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/auth", authRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err.message,
  });
});

// shutdown logic -  "graceful"
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await database.close();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Shutting down server...");
  await database.close();
  process.exit(0);
});

// initialize app logic
async function initApp() {
  try {
    await database.connect();
    app.listen(port, () => {
      console.log(`RetailXplore backend is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

initApp();
