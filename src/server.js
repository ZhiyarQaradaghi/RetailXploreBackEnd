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
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");
const pdfRoutes = require("./routes/pdfRoutes");
const chatRoutes = require("./routes/chatRoutes");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173", // Frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// this is for the preflight requests meaning when the client makes a request to the server it will send a preflight request to the server to check if the server is allowed to make the request
app.options("*", cors());

// Middleware
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  message: "Too many requests, please try again later",
});

const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // higher limit for cart operations
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later",
});

app.use("/images", express.static(path.join(__dirname, "../public/images")));

// applied rate limiting to all product routes
app.use("/", apiLimiter, productRoutes);
app.use("/", cartLimiter, cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", contactRoutes);
app.use("/api", pdfRoutes);
app.use("/api", chatRoutes);

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
