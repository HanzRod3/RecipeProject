import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = 8004;
// Middleware setup
app.use(express.json());
app.use(cors());

// Database connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Database connection error:", err));

// Start server
app.listen(8004, () => console.log("Server running on port 8004"));
