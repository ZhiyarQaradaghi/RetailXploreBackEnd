const express = require("express");
const cors = require("cors");
const path = require("path");
const database = require("./database/connection");
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3003;

// cors
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../public/images")));
// our routes
app.use("/", productRoutes);

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
