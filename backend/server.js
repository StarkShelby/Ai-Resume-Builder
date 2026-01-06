require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");

const app = express();

// Trust proxy for Render/Heroku functionality
app.set("trust proxy", 1);

// Middleware
app.use(cors({
  origin: true, // Allow all origins (reflects request origin)
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(express.json({ limit: "10mb" }));
require("./config/passport");

// Connect DB
connectDB();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api", require("./routes/upload"));

// DEFAULT
app.get("/", (req, res) => {
  res.send("API is running...");
});

// START SERVER
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
