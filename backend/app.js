const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// dotenv is used to load environment variables from a .env file into process.env.
dotenv.config();

const requiredEnv = ["MONGO_URI", "JWT_SECRET"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]);
if (missingEnv.length) {
  console.error(
    `Missing required environment variables: ${missingEnv.join(", ")}`,
  );
  process.exit(1);
}

if (!process.env.CLIENT_URL) {
  console.warn(
    "CLIENT_URL is not set. Defaulting to http://localhost:5173 for CORS.",
  );
}

connectDB();

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "https://mern-taskmanager-1-5ccb.onrender.com",
  "https://mern-taskmanager-drab.vercel.app",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: "Server Error", error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
