require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const resumeRoutes = require("./routes/resumes");

const app = express();

/* REQUIRED FOR RENDER */
app.set("trust proxy", 1);

/* CORS — MUST COME BEFORE ROUTES */
const allowedOrigins = [
  "http://localhost:3000",
  "https://ai-resume-builder-frontend-v1-5ryszvxsb.vercel.app",
  "https://ai-resume-builder-frontend-v1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* HANDLE PREFLIGHT */
app.options("*", cors());

app.use(express.json({ limit: "10mb" }));
require("./config/passport");

/* DB */
connectDB();

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/resumes", resumeRoutes);
app.use("/api", require("./routes/upload"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
